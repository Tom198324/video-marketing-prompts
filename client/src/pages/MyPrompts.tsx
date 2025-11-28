import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Folder, FolderPlus, Search, Trash2, Edit, Tag, 
  Share2, Clock, ChevronRight, FileText, Plus
} from "lucide-react";

export default function MyPrompts() {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

  const utils = trpc.useUtils();
  
  const { data: folders } = trpc.library.getMyFolders.useQuery();
  const { data: prompts } = trpc.library.getMyPrompts.useQuery(
    { folderId: selectedFolderId },
    { enabled: searchTerm === "" }
  );
  const { data: searchResults } = trpc.library.searchPrompts.useQuery(
    { searchTerm },
    { enabled: searchTerm.length > 0 }
  );

  const createFolderMutation = trpc.library.createFolder.useMutation({
    onSuccess: () => {
      utils.library.getMyFolders.invalidate();
      setNewFolderName("");
      setIsCreateFolderOpen(false);
      toast.success("Folder created!");
    },
    onError: (error) => {
      toast.error(`Failed to create folder: ${error.message}`);
    },
  });

  const deletePromptMutation = trpc.library.deletePrompt.useMutation({
    onSuccess: () => {
      utils.library.getMyPrompts.invalidate();
      toast.success("Prompt deleted!");
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });

  const deleteFolderMutation = trpc.library.deleteFolder.useMutation({
    onSuccess: () => {
      utils.library.getMyFolders.invalidate();
      utils.library.getMyPrompts.invalidate();
      setSelectedFolderId(null);
      toast.success("Folder deleted! Prompts moved to root.");
    },
    onError: (error) => {
      toast.error(`Failed to delete folder: ${error.message}`);
    },
  });

  const displayedPrompts = searchTerm ? searchResults : prompts;

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast.error("Folder name cannot be empty");
      return;
    }
    createFolderMutation.mutate({ name: newFolderName });
  };

  const handleDeletePrompt = (id: number) => {
    if (confirm("Are you sure you want to delete this prompt?")) {
      deletePromptMutation.mutate({ id });
    }
  };

  const handleDeleteFolder = (id: number) => {
    if (confirm("Delete this folder? Prompts inside will be moved to root.")) {
      deleteFolderMutation.mutate({ id });
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Prompts</h1>
          <p className="text-muted-foreground">
            Organize and manage your custom validated prompts
          </p>
        </div>
        <Button asChild>
          <a href="/validator">
            <Plus className="mr-2 h-4 w-4" />
            Create New Prompt
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Folders */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Folders</CardTitle>
                <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <FolderPlus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Folder</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <Input
                        placeholder="Folder name..."
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCreateFolder();
                        }}
                      />
                      <Button 
                        onClick={handleCreateFolder}
                        disabled={createFolderMutation.isPending}
                        className="w-full"
                      >
                        Create Folder
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <button
                onClick={() => setSelectedFolderId(null)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedFolderId === null
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>All Prompts</span>
                <span className="ml-auto text-xs opacity-70">
                  {prompts?.length || 0}
                </span>
              </button>

              {folders?.map((folder) => (
                <div key={folder.id} className="group relative">
                  <button
                    onClick={() => setSelectedFolderId(folder.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedFolderId === folder.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    <Folder className="h-4 w-4" />
                    <span className="flex-1 text-left truncate">{folder.name}</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-7 w-7 p-0 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFolder(folder.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content: Prompts Grid */}
        <div className="lg:col-span-3">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prompts by title or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Prompts Grid */}
          {displayedPrompts && displayedPrompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedPrompts.map((prompt) => (
                <Card key={prompt.id} className="group relative hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2">{prompt.title}</CardTitle>
                      {prompt.qualityScore && (
                        <div className="flex-shrink-0 px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                          {prompt.qualityScore}/10
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Tags */}
                    {prompt.tags && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        {prompt.tags.split(",").filter(Boolean).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(prompt.updatedAt!).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <a href={`/prompt-detail/${prompt.id}`}>
                          <Edit className="mr-2 h-3 w-3" />
                          Edit
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info("Share feature coming soon!")}
                      >
                        <Share2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePrompt(prompt.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No prompts yet</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? "No prompts match your search"
                    : "Create your first prompt to get started"}
                </p>
                {!searchTerm && (
                  <Button asChild>
                    <a href="/validator">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Prompt
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
