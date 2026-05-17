import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegisterModalProps {
  trigger?: React.ReactElement;
}

export function RegisterModal({ trigger }: RegisterModalProps) {
  return (
    <Dialog>
      <DialogTrigger render={trigger || <Button className="bg-brand-purple hover:bg-brand-purple/90">Register Now</Button>} />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-heading">Start Your Journey</DialogTitle>
          <DialogDescription>
            Fill out the form below to register for your certification pathway.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="certification">Select Certification</Label>
              <Select>
                <SelectTrigger id="certification">
                  <SelectValue placeholder="Choose one" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pmp">PMP®</SelectItem>
                  <SelectItem value="capm">CAPM®</SelectItem>
                  <SelectItem value="acp">PMI-ACP®</SelectItem>
                  <SelectItem value="rmp">PMI-RMP®</SelectItem>
                  <SelectItem value="prince2">PRINCE2®</SelectItem>
                  <SelectItem value="six-sigma">Six Sigma Green Belt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier">Select Tier</Label>
              <Select>
                <SelectTrigger id="tier">
                  <SelectValue placeholder="Choose one" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">Country / Region</Label>
            <Input id="region" placeholder="e.g. United States, India, UK" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience Level</Label>
              <Select>
                <SelectTrigger id="experience">
                  <SelectValue placeholder="Choose one" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid (3-7 years)</SelectItem>
                  <SelectItem value="senior">Senior (8+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="w-full bg-brand-purple hover:bg-brand-purple/90 h-12 text-lg">
            Complete Registration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
