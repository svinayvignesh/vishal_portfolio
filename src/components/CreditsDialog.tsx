
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";

export function CreditsDialog() {
    const credits = [
        {
            title: "CNC Machine",
            author: "Khushbushah",
            authorUrl: "https://sketchfab.com/Khushbushah",
            modelUrl: "https://sketchfab.com/3d-models/cnc-machine-af387e70d78a4ba4886af58dd7aec96b",
            license: "CC-BY-4.0",
            licenseUrl: "http://creativecommons.org/licenses/by/4.0/"
        },
        {
            title: "Ford F150 Raptor",
            author: "Outlaw Games™",
            authorUrl: "https://sketchfab.com/Outlaw_Games",
            modelUrl: "https://sketchfab.com/3d-models/ford-f150-raptor-5bde9684bf6d40e0902ee8e482ad1063",
            license: "CC-BY-NC-4.0",
            licenseUrl: "http://creativecommons.org/licenses/by-nc/4.0/"
        },
        {
            title: "Schaefer Gas Aluminum Furnace",
            author: "The Schaefer Group",
            authorUrl: "https://sketchfab.com/schaefergroup",
            modelUrl: "https://sketchfab.com/3d-models/schaefer-gas-aluminum-furnace-1ff6be358af648e9aa94de221bad73aa",
            license: "CC-BY-NC-ND-4.0",
            licenseUrl: "http://creativecommons.org/licenses/by-nc-nd/4.0/"
        },
        {
            title: "Document File Folder",
            author: "Kami Rapacz",
            authorUrl: "https://sketchfab.com/kuroderuta",
            modelUrl: "https://sketchfab.com/3d-models/document-file-folder-11390179bba7462484d344e2fe22c703",
            license: "CC-BY-4.0",
            licenseUrl: "http://creativecommons.org/licenses/by/4.0/"
        },
        {
            title: "Resin 3D Printer",
            author: "YouniqueĪdeaStudio",
            authorUrl: "https://sketchfab.com/sinnervoncrawsz",
            modelUrl: "https://sketchfab.com/3d-models/resin-3d-printer-b77b9c1c4c1b4a35a867beebeac5de60",
            license: "CC-BY-4.0",
            licenseUrl: "http://creativecommons.org/licenses/by/4.0/"
        },
        {
            title: "Turbine-01",
            author: "Karan.Dhindsa",
            authorUrl: "https://sketchfab.com/Karan.Dhindsa",
            modelUrl: "https://sketchfab.com/3d-models/turbine-01-e03a3c7ce147460e948f56573d1fdf87",
            license: "CC-BY-4.0",
            licenseUrl: "http://creativecommons.org/licenses/by/4.0/"
        }
    ];

    return (
        <div className="fixed bottom-4 right-4 z-50 print:hidden">
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-10 w-10 bg-background/80 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all"
                        aria-label="View Credits"
                    >
                        <Info className="h-5 w-5" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>3D Model Credits</DialogTitle>
                        <DialogDescription>
                            This portfolio uses the following 3D models licensed under Creative Commons.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                        <div className="flex flex-col gap-4">
                            {credits.map((item, index) => (
                                <div key={index} className="text-sm">
                                    <a
                                        href={item.modelUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-semibold hover:underline"
                                    >
                                        {item.title}
                                    </a>
                                    <div className="text-muted-foreground text-xs mt-1">
                                        by <a href={item.authorUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{item.author}</a>
                                    </div>
                                    <div className="text-muted-foreground text-xs">
                                        Licensed under <a href={item.licenseUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{item.license}</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}
