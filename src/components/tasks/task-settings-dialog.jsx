import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SettingsForm } from "@/app/(root)/@authenticated/settings/_components/settings-form";

export function TaskSettingsDialog({ user }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Avatar className="size-12 cursor-pointer">
            <AvatarImage src={""} className="h-full w-full object-cover" />
            <AvatarFallback className="bg-gray-700/30 capitalize">
              {user?.displayName?.slice(0, 2) || "JD"}
            </AvatarFallback>
          </Avatar>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inställningar</DialogTitle>
          </DialogHeader>
          <SettingsForm user={user} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Avatar className="size-12 cursor-pointer">
          <AvatarImage src={""} className="h-full w-full object-cover" />
          <AvatarFallback className="bg-gray-700/30 capitalize">
            {user?.displayName?.slice(0, 2) || "JD"}
          </AvatarFallback>
        </Avatar>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Inställningar</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 h-[80svh] overflow-y-auto">
          <SettingsForm user={user} />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
