"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ComponentType,
  useEffect,
  useRef,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { icons } from "./Icons";

// Types
export type SingleIcon = {
  id: number;
  icon: React.ReactNode;
  isSelected: boolean;
};

type IconContextType = {
  updateSelectedIcon: (icon: ReactNode) => void;
  openDialog: boolean;
  updateOpenDialog: (openDialog: boolean) => void;
  allIcons: SingleIcon[];
  setAllIcons: React.Dispatch<React.SetStateAction<SingleIcon[]>>;
  triggerIconSelection: (icon: string) => void;
};

// Context
const IconContext = createContext<IconContextType | undefined>(undefined);

// Provider Component
export const IconProvider = ({
  children,
  iconsArray,
  onUpdateIcon,
}: {
  children: ReactNode;
  iconsArray: SingleIcon[];
  onUpdateIcon: (selectedIcon: ReactNode) => void;
}) => {
  const [openDialog, updateOpenDialog] = useState(false);

  // Initialize with first icon selected by default
  const [allIcons, setAllIcons] = useState<SingleIcon[]>(() => {
    if (iconsArray.length > 0) {
      const initialIcons = iconsArray.map((icon, index) => ({
        ...icon,
        isSelected: index === 0, // Select first icon by default
      }));
      // Call onUpdateIcon with the first icon
      setTimeout(() => onUpdateIcon(initialIcons[0].icon), 0);
      return initialIcons;
    }
    return iconsArray;
  });

  const isInitialMount = useRef(true);

  const updateSelectedIcon = (icon: ReactNode) => {
    onUpdateIcon(icon);
  };

  const triggerIconSelection = (icon: string) => {
    // Use setTimeout to defer the state update to the next tick
    setTimeout(() => {
      try {
        const iconNode = convertStringToIcon(icon, allIcons);
        if (iconNode) {
          const updatedIcons = allIcons.map((singleIcon) => ({
            ...singleIcon,
            isSelected: singleIcon.icon === iconNode,
          }));
          setAllIcons(updatedIcons);
          updateSelectedIcon(iconNode);
        }
      } catch (error) {
        console.error(error);
      }
    }, 0);
  };

  return (
    <IconContext.Provider
      value={{
        updateSelectedIcon,
        openDialog,
        updateOpenDialog,
        allIcons,
        setAllIcons,
        triggerIconSelection,
      }}
    >
      {children}
    </IconContext.Provider>
  );
};

// Custom Hook
export const useIconContext = () => {
  const context = useContext(IconContext);
  if (!context) {
    throw new Error("useIconContext must be used within an IconProvider");
  }
  return context;
};

// Utility Functions
//------------------

//function to convert icon with a ReactNode type to a string
export function convertIconToString(icon: ReactNode): string | null {
  if (icon && (icon as React.ReactElement).type) {
    const iconType = (icon as React.ReactElement).type;
    if (typeof iconType === "function") {
      const iconName = (iconType as ComponentType).displayName || iconType.name;
      return iconName;
    }
  }
  return null;
}

//function to convert the icon from a string to a React Node
export function convertStringToIcon(
  iconText: string,
  iconsArray: SingleIcon[]
): ReactNode {
  if (!iconText || !iconsArray) {
    throw new Error("Please set the icon text and the array of icons.");
  }
  for (const iconObj of iconsArray) {
    const iconType = (iconObj.icon as React.ReactElement).type;
    if (typeof iconType === "function") {
      const iconName = iconType.name;
      if (iconText === iconName) {
        return iconObj.icon;
      }
    }
  }
  throw new Error(`Icon with text "${iconText}" not found in the icon array.`);
}

// Icon Dialog Box Component
export function IconDialogBox() {
  const {
    updateSelectedIcon,
    openDialog,
    updateOpenDialog,
    allIcons,
    setAllIcons,
  } = useIconContext();

  function updateSelection(singleIconProp: SingleIcon) {
    setAllIcons((prevArray) =>
      prevArray.map((singleIcon) => {
        if (singleIcon.id === singleIconProp.id) {
          updateSelectedIcon(singleIcon.icon);
          updateOpenDialog(!openDialog);
          return { ...singleIcon, isSelected: true };
        }
        return { ...singleIcon, isSelected: false };
      })
    );
  }

  if (!isAllIconsValid(allIcons)) {
    throw new Error("The allIcons array structure is invalid");
  }

  function isAllIconsValid(allIcons: unknown) {
    if (!Array.isArray(allIcons)) {
      throw Error("Please provide an array");
    }
    return allIcons.every(
      (icon) =>
        typeof icon.id === "number" &&
        typeof icon.isSelected === "boolean" &&
        React.isValidElement(icon.icon)
    );
  }

  return (
    <Dialog open={openDialog} onOpenChange={(open) => updateOpenDialog(open)}>
      <DialogTrigger asChild>
        <Button className="h-11">
          {allIcons.find((icon) => icon.isSelected)?.icon}
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-2xl mt-5">
        <DialogHeader>
          <DialogTitle>Select an Icon</DialogTitle>
          <DialogDescription>
            Pick an icon to represent your content. You can update it anytime.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full border rounded-lg p-3 flex flex-wrap gap-2 mt-5 justify-center">
          {allIcons.map((singleIcon, index) => (
            <div
              className={`rounded-md border p-3 hover:bg-primary hover:text-white h-10 w-10 cursor-pointer ${
                singleIcon.isSelected
                  ? "bg-primary text-white border-none"
                  : "text-slate-400"
              }`}
              key={index}
              onClick={() => updateSelection(singleIcon)}
            >
              {singleIcon.icon}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function IconSelector({
  onUpdateIcon,
  iconToSelected,
}: {
  onUpdateIcon: (selectedIcon: ReactNode) => void;
  iconToSelected?: string;
}) {
  function updatedIcon(selectedIcon: ReactNode) {
    onUpdateIcon(selectedIcon);
  }

  return (
    <IconProvider iconsArray={icons} onUpdateIcon={updatedIcon}>
      <ParentComponent iconToSelected={iconToSelected} />
    </IconProvider>
  );

  function ParentComponent({ iconToSelected }: { iconToSelected?: string }) {
    const { triggerIconSelection } = useIconContext();

    useEffect(() => {
      if (iconToSelected) {
        triggerIconSelection(iconToSelected);
      }
    }, [iconToSelected, triggerIconSelection]);

    return <IconDialogBox />;
  }
}
