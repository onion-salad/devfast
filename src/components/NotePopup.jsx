import React, { useState, useEffect, useRef } from 'react';
import { X, StickyNote, Send } from 'lucide-react';
import { useAddMemo } from '../integrations/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const services = [
  'ChatGPT', 'Claude', 'GPT-Engineer', 'v0', 'Cosor', 'Dify', 'Supabase',
  'Google Cloud Console', 'Twitter', 'Facebook', 'LinkedIn', 'PR Times',
  'Product Hunt', 'Note'
];

const NotePopup = ({ onClose }) => {
  const [note, setNote] = useState('');
  const [tool, setTool] = useState('');
  const textareaRef = useRef(null);
  const addMemoMutation = useAddMemo();

  useEffect(() => {
    textareaRef.current.focus();
  }, []);

  const handleSave = async () => {
    if (note.trim()) {
      try {
        await addMemoMutation.mutateAsync({ 
          memo: [{ 
            text: note.trim(),
            tool
          }] 
        });
        onClose();
      } catch (error) {
        console.error('Failed to add memo:', error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.metaKey) {
      if (note.trim()) {
        handleSave();
      }
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onKeyDown={handleKeyDown}>
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-indigo-500" />
            クイックメモ
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              ref={textareaRef}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[150px] resize-none"
              placeholder="メモを入力してください..."
            />
            <div className="flex gap-4">
              <Select onValueChange={setTool} value={tool}>
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
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2"
                disabled={!note.trim()}
              >
                <Send className="h-4 w-4" />
                保存 (⌘+Enter)
              </Button>
            </div>
            <p className="text-sm text-gray-500 text-center">
              ESCキーで閉じる
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotePopup;