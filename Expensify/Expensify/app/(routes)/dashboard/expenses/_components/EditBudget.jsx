"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; 
import { PenBox } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; 
import EmojiPicker from "emoji-picker-react";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input"; 
import { db } from "@/utils/dbConfig"; 
import { Budgets } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

function EditBudget({ budgetInfo, refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon || '🎯');  
  const [openEmojiPicker, setEmojiPicker] = useState(false);
  const [name, setName] = useState(budgetInfo?.name || ''); 
  const [amount, setAmount] = useState(budgetInfo?.amount || ''); 
  const [openDialog, setOpenDialog] = useState(false); 
  const { user } = useUser();

  useEffect(() => {
    if (budgetInfo) {
      setEmojiIcon(budgetInfo?.icon);
      setAmount(budgetInfo.amount);
      setName(budgetInfo.name);
    }
  }, [budgetInfo]);

  const onUpdateBudget = async () => {
    if (!name.trim()) {
      toast.error("Budget name cannot be empty!");
      return;
    }
  
    const validAmount = amount ? parseFloat(amount) : 0;
    if (validAmount < 0) {
      toast.error("Budget amount must be greater than or equal to 0!");
      return;
    }
  
    try {
      const result = await db
        .update(Budgets)
        .set({
          name: name,
          amount: validAmount,
          icon: emojiIcon,
        })
        .where(eq(Budgets.id, budgetInfo.id))
        .returning();
  
      if (result) {
        refreshData();
        toast.success("Budget Updated!");
        setOpenDialog(false); 
      }
    } catch (error) {
      toast.error("Failed to update budget. Please try again.");
    }
  };
  

  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button className="flex gap-2" onClick={() => setOpenDialog(true)}><PenBox /> Edit</Button>
        </DialogTrigger>

        <DialogContent className="bg-[#1a1a1a] text-white rounded-lg shadow-xl p-6 w-full md:w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center">Update Budget</DialogTitle>
            <DialogDescription className="mt-4 text-center text-white">
              <div className="relative">
                <Button
                  variant="outline"
                  className="text-lg text-white border-white hover:bg-[#444] focus:ring-2 focus:ring-white mx-auto"
                  onClick={() => setEmojiPicker(!openEmojiPicker)}
                >
                  {emojiIcon}
                </Button>
                {openEmojiPicker && (
                  <div className="absolute z-20 mt-2">
                    <EmojiPicker
                      onEmojiClick={(e) => {
                        setEmojiIcon(e.emoji);
                        setEmojiPicker(false);
                      }}
                      theme="dark"
                    />
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h2 className="font-medium my-1 text-lg text-center">Budget Name</h2>
                <Input
                  placeholder="e.g. Home Decor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#333] text-white border-[#555] focus:ring-2 focus:ring-white placeholder-gray-400 w-full p-3 rounded-md"
                />
              </div>
              <div className="mt-4">
                <h2 className="font-medium my-1 text-lg text-center">Budget Amount</h2>
                <Input
                  type="number"
                  placeholder="e.g. 5000$"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-[#333] text-white border-[#555] focus:ring-2 focus:ring-white placeholder-gray-400 w-full p-3 rounded-md"
                />
              </div>
              <Button
                onClick={() => onUpdateBudget()}
                className="mt-5 w-full bg-[#3a3a3a] text-white hover:bg-[#555] p-3 rounded-md"
              >
                Update Budget
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditBudget;
