import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from 'react-i18next';
import { Trash2, Plus } from 'lucide-react';
import { useMemos, useAddMemo, useDeleteMemo } from '../integrations/supabase';
import { useSelectedServices } from '../context/SelectedServicesContext';
import Notification from '../components/Notification';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

const Notes = () => {
  const { t } = useTranslation();
  const [newNote, setNewNote] = useState({ text: '', tool: '' });
  const { data: memos, isLoading, error } = useMemos();
  const addMemoMutation = useAddMemo();
  const deleteMemoMutation = useDeleteMemo();
  const { notification } = useSelectedServices();

  const services = [
    'ChatGPT', 'Claude', 'GPT-Engineer', 'v0', 'Cosor', 'Dify', 'Supabase',
    'Google Cloud Console', 'Twitter', 'Facebook', 'LinkedIn', 'PR Times',
    'Product Hunt', 'Note'
  ];

  const addNote = async () => {
    if (newNote.text.trim()) {
      try {
        await addMemoMutation.mutateAsync({ memo: [newNote] });
        setNewNote({ text: '', tool: '' });
      } catch (error) {
        console.error('Failed to add memo:', error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.metaKey) {
      addNote();
    }
  };

  const deleteNote = async (id) => {
    try {
      await deleteMemoMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete memo:', error);
    }
  };

  const sanitizeMemos = (memos) => {
    if (!Array.isArray(memos)) return [];
    return memos.map(memo => {
      if (!memo || !Array.isArray(memo.memo)) return null;
      return memo.memo.map(item => ({
        id: memo.id,
        text: item.text || '',
        tool: item.tool || ''
      }));
    }).filter(Boolean).flat();
  };

  const sanitizedMemos = sanitizeMemos(memos);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-lg">読み込み中...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-red-500">エラー: {error.message}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{t('notes.title')}</h1>
            <span className="text-sm text-gray-500">(⌘+M)</span>
          </div>
          <p className="text-gray-600">アイデアやタスクをメモとして記録しましょう</p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Textarea
                value={newNote.text}
                onChange={(e) => setNewNote({...newNote, text: e.target.value})}
                placeholder="新しいメモを入力..."
                className="min-h-[120px]"
                onKeyDown={handleKeyDown}
              />
              <div className="flex gap-4">
                <Select 
                  value={newNote.tool}
                  onValueChange={(value) => setNewNote({...newNote, tool: value})}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="ツールを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service} value={service}>{service}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={addNote} 
                  className="flex items-center gap-2"
                  disabled={!newNote.text.trim()}
                >
                  <Plus className="h-4 w-4" />
                  追加 (⌘+Enter)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <ScrollArea className="h-[60vh]">
          <div className="space-y-4 pr-4">
            {sanitizedMemos.map((note, index) => (
              <Card key={index} className="group">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap">{note.text}</p>
                      {note.tool && (
                        <p className="text-sm text-gray-500 mt-2">
                          ツール: {note.tool}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNote(note.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
      {notification && <Notification message={notification} />}
    </Layout>
  );
};

export default Notes;
