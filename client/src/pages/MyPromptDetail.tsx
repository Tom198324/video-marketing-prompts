import { useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Header from "@/components/Header";
import { 
  ArrowLeft, Edit, Save, X, Clock, MessageSquare, Share2, 
  Trash2, RotateCcw, Send, Copy, UserPlus
} from "lucide-react";
import { QualityBadge } from "@/components/QualityBadge";

export default function MyPromptDetail() {
  const [, params] = useRoute("/my-prompt/:id");
  const promptId = params?.id ? parseInt(params.id) : 0;

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [shareEmail, setShareEmail] = useState("");

  const utils = trpc.useUtils();

  const { data: prompts } = trpc.library.getMyPrompts.useQuery({});
  const prompt = prompts?.find(p => p.id === promptId);

  const { data: folders } = trpc.library.getMyFolders.useQuery();
  const { data: versions } = trpc.library.getVersions.useQuery(
    { promptId },
    { enabled: promptId > 0 }
  );
  const { data: comments } = trpc.library.getComments.useQuery(
    { promptId },
    { enabled: promptId > 0 }
  );
  const { data: shares } = trpc.library.getSharedWith.useQuery(
    { promptId },
    { enabled: promptId > 0 }
  );

  // Initialize edit state when prompt loads
  useState(() => {
    if (prompt) {
      setEditTitle(prompt.title);
      setEditTags(prompt.tags || "");
      setSelectedFolderId(prompt.folderId);
    }
  });

  const updatePromptMutation = trpc.library.updatePrompt.useMutation({
    onSuccess: () => {
      utils.library.getMyPrompts.invalidate();
      setIsEditing(false);
      toast.success("Prompt updated!");
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });

  const addCommentMutation = trpc.library.addComment.useMutation({
    onSuccess: () => {
      utils.library.getComments.invalidate({ promptId });
      setNewComment("");
      toast.success("Comment added!");
    },
    onError: (error) => {
      toast.error(`Failed to add comment: ${error.message}`);
    },
  });

  const sharePromptMutation = trpc.library.shareByEmail.useMutation({
    onSuccess: () => {
      utils.library.getSharedWith.invalidate({ promptId });
      setShareEmail("");
      toast.success("Prompt shared!");
    },
    onError: (error) => {
      toast.error(`Failed to share: ${error.message}`);
    },
  });

  const removeShareMutation = trpc.library.removeShare.useMutation({
    onSuccess: () => {
      utils.library.getSharedWith.invalidate({ promptId });
      toast.success("Share access removed!");
    },
    onError: (error) => {
      toast.error(`Failed to remove share: ${error.message}`);
    },
  });

  const saveVersionMutation = trpc.library.saveVersion.useMutation({
    onSuccess: () => {
      utils.library.getVersions.invalidate({ promptId });
      toast.success("Version saved!");
    },
    onError: (error) => {
      toast.error(`Failed to save version: ${error.message}`);
    },
  });

  const handleSaveEdit = () => {
    updatePromptMutation.mutate({
      id: promptId,
      title: editTitle,
      tags: editTags,
      folderId: selectedFolderId,
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    addCommentMutation.mutate({
      promptId,
      commentText: newComment.trim(),
    });
  };

  const handleShare = () => {
    if (!shareEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    sharePromptMutation.mutate({
      promptId,
      sharedWithEmail: shareEmail.trim(),
      permission: "view",
    });
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/my-prompt/${promptId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  if (!prompt) {
    return (
      <div className="container py-8">
      <Header />

        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Prompt not found</h3>
            <p className="text-muted-foreground mb-4">
              The prompt you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button asChild>
              <a href="/my-prompts">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to My Prompts
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <a href="/my-prompts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Prompts
          </a>
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Prompt title..."
                  />
                </div>
                <div>
                  <Label>Tags (comma-separated)</Label>
                  <Input
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="e.g., marketing, product, commercial"
                  />
                </div>
                <div>
                  <Label>Folder</Label>
                  <Select
                    value={selectedFolderId?.toString() || "none"}
                    onValueChange={(value) => setSelectedFolderId(value === "none" ? null : parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select folder..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Folder</SelectItem>
                      {folders?.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id.toString()}>
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveEdit} disabled={updatePromptMutation.isPending}>
                    <Save className="mr-2 h-4 w-4" />
                    {updatePromptMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{prompt.title}</h1>
                  {prompt.qualityScore && <QualityBadge score={prompt.qualityScore} />}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Created: {new Date(prompt.createdAt!).toLocaleDateString()}</span>
                  <span>Updated: {new Date(prompt.updatedAt!).toLocaleDateString()}</span>
                  {prompt.tags && (
                    <div className="flex items-center gap-2">
                      {prompt.tags.split(",").filter(Boolean).map((tag, idx) => (
                        <Badge key={idx} variant="secondary">{tag.trim()}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Metadata
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="prompt" className="space-y-4">
        <TabsList>
          <TabsTrigger value="prompt">Prompt JSON</TabsTrigger>
          <TabsTrigger value="versions">
            Version History ({versions?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="comments">
            Comments ({comments?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="sharing">Sharing</TabsTrigger>
        </TabsList>

        {/* Prompt JSON Tab */}
        <TabsContent value="prompt">
          <Card>
            <CardHeader>
              <CardTitle>Prompt JSON</CardTitle>
              <CardDescription>Complete prompt specification</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(prompt.promptJson, null, 2)}
              </pre>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(prompt.promptJson, null, 2));
                    toast.success("JSON copied to clipboard!");
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy JSON
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    saveVersionMutation.mutate({
                      promptId,
                      promptJson: prompt.promptJson,
                    });
                  }}
                  disabled={saveVersionMutation.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save as New Version
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Version History Tab */}
        <TabsContent value="versions">
          <Card>
            <CardHeader>
              <CardTitle>Version History</CardTitle>
              <CardDescription>Track all changes to this prompt</CardDescription>
            </CardHeader>
            <CardContent>
              {versions && versions.length > 0 ? (
                <div className="space-y-4">
                  {versions.map((version: any) => (
                    <div key={version.promptVersions.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold">Version {version.promptVersions.versionNumber}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(version.promptVersions.createdAt).toLocaleString()}
                          </div>
                          {version.users.name && (
                            <div className="text-sm text-muted-foreground">
                              by {version.users.name}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast.info("Restore feature coming soon!");
                          }}
                        >
                          <RotateCcw className="mr-2 h-3 w-3" />
                          Restore
                        </Button>
                      </div>
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                          View JSON
                        </summary>
                        <pre className="bg-muted p-3 rounded mt-2 text-xs overflow-x-auto">
                          {JSON.stringify(version.promptJson, null, 2)}
                        </pre>
                      </details>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="mx-auto h-12 w-12 mb-2 opacity-50" />
                  <p>No version history yet</p>
                  <p className="text-sm">Save versions to track changes over time</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
              <CardDescription>Collaborate with your team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Comment */}
              <div className="space-y-2">
                <Label>Add a comment</Label>
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <Button 
                  onClick={handleAddComment}
                  disabled={addCommentMutation.isPending || !newComment.trim()}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {addCommentMutation.isPending ? "Posting..." : "Post Comment"}
                </Button>
              </div>

              {/* Comments List */}
              <div className="border-t pt-4">
                {comments && comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment: any) => (
                      <div key={comment.promptComments.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-semibold">{comment.users.name || "Unknown User"}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(comment.promptComments.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm">{comment.promptComments.commentText}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="mx-auto h-12 w-12 mb-2 opacity-50" />
                    <p>No comments yet</p>
                    <p className="text-sm">Be the first to comment!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sharing Tab */}
        <TabsContent value="sharing">
          <Card>
            <CardHeader>
              <CardTitle>Share with Team</CardTitle>
              <CardDescription>Collaborate by sharing this prompt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Share Form */}
              <div className="space-y-2">
                <Label>Share with user (by email)</Label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="colleague@example.com"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                  />
                  <Button 
                    onClick={handleShare}
                    disabled={sharePromptMutation.isPending || !shareEmail.trim()}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    {sharePromptMutation.isPending ? "Sharing..." : "Share"}
                  </Button>
                </div>
              </div>

              {/* Copy Link */}
              <div className="space-y-2">
                <Label>Or copy link</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={`${window.location.origin}/my-prompt/${promptId}`}
                  />
                  <Button variant="outline" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Shared With List */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Shared with</h4>
                {shares && shares.length > 0 ? (
                  <div className="space-y-2">
                    {shares.map((share: any) => (
                      <div key={share.promptShares.id} className="flex items-center justify-between border rounded-lg p-3">
                        <div>
                          <div className="font-medium">{share.users.email}</div>
                          <div className="text-xs text-muted-foreground">
                            Shared {new Date(share.promptShares.sharedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            removeShareMutation.mutate({ 
                              promptId, 
                              sharedWithUserId: share.promptShares.sharedWithUserId 
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Share2 className="mx-auto h-12 w-12 mb-2 opacity-50" />
                    <p>Not shared with anyone yet</p>
                    <p className="text-sm">Share to collaborate with your team</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
