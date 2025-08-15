"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, useToast, toastMessages } from "@/components/ui/toast";

export default function ToastDemoPage() {
  const { toast: hookToast } = useToast();
  const [customMessage, setCustomMessage] = useState("");

  const handleCustomToast = () => {
    if (customMessage.trim()) {
      toast.success(customMessage);
      setCustomMessage("");
    }
  };

  const simulateAuthFlow = async () => {
    // Simulate login
    toast.loading("Đang đăng nhập...");
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.dismiss();
    toast.success(toastMessages.auth.loginSuccess);
  };

  const simulatePromise = async () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve("Thành công!");
        } else {
          reject(new Error("Có lỗi xảy ra!"));
        }
      }, 2000);
    });

    toast.promise(promise, {
      loading: "Đang xử lý...",
      success: "Hoàn thành thành công!",
      error: "Đã xảy ra lỗi!",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Toast System Demo</h1>
        <p className="text-muted-foreground">Demo hệ thống toast notifications</p>
      </div>

      {/* Basic Toast Types */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Toast Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              onClick={() => toast.success("Thành công!")}
              variant="default"
              className="w-full"
            >
              Success Toast
            </Button>
            
            <Button 
              onClick={() => toast.error("Có lỗi xảy ra!")}
              variant="destructive"
              className="w-full"
            >
              Error Toast
            </Button>
            
            <Button 
              onClick={() => toast.warning("Cảnh báo!")}
              variant="outline"
              className="w-full"
            >
              Warning Toast
            </Button>
            
            <Button 
              onClick={() => toast.info("Thông tin")}
              variant="secondary"
              className="w-full"
            >
              Info Toast
            </Button>
            
            <Button 
              onClick={() => toast.loading("Đang xử lý...")}
              variant="outline"
              className="w-full"
            >
              Loading Toast
            </Button>
            
            <Button 
              onClick={() => toast.dismiss()}
              variant="ghost"
              className="w-full"
            >
              Dismiss All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Predefined Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Predefined Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => toast.success(toastMessages.auth.loginSuccess)}
              variant="default"
              className="w-full"
            >
              Login Success
            </Button>
            
            <Button 
              onClick={() => toast.success(toastMessages.auth.logoutSuccess)}
              variant="default"
              className="w-full"
            >
              Logout Success
            </Button>
            
            <Button 
              onClick={() => toast.success(toastMessages.auth.registerSuccess)}
              variant="default"
              className="w-full"
            >
              Register Success
            </Button>
            
            <Button 
              onClick={() => toast.error(toastMessages.auth.loginError)}
              variant="destructive"
              className="w-full"
            >
              Login Error
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hook Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Hook Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => hookToast.success("Hook Success!")}
              variant="default"
              className="w-full"
            >
              Hook Success
            </Button>
            
            <Button 
              onClick={() => hookToast.error("Hook Error!")}
              variant="destructive"
              className="w-full"
            >
              Hook Error
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Custom Message */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="custom-message">Message</Label>
              <Input
                id="custom-message"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Nhập tin nhắn tùy chỉnh..."
                onKeyPress={(e) => e.key === 'Enter' && handleCustomToast()}
              />
            </div>
            <Button 
              onClick={handleCustomToast}
              disabled={!customMessage.trim()}
              className="mt-6"
            >
              Show Toast
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Promise Toast */}
      <Card>
        <CardHeader>
          <CardTitle>Promise Toast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={simulatePromise}
              variant="default"
              className="w-full"
            >
              Simulate Promise
            </Button>
            
            <Button 
              onClick={simulateAuthFlow}
              variant="outline"
              className="w-full"
            >
              Simulate Auth Flow
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Toast with Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Toast with Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => toast.success("Thành công!", {
                action: {
                  label: "Hoàn tác",
                  onClick: () => console.log("Undo clicked!")
                }
              })}
              variant="default"
              className="w-full"
            >
              Success with Action
            </Button>
            
            <Button 
              onClick={() => toast.error("Có lỗi xảy ra!", {
                action: {
                  label: "Thử lại",
                  onClick: () => console.log("Retry clicked!")
                }
              })}
              variant="destructive"
              className="w-full"
            >
              Error with Action
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Duration Control */}
      <Card>
        <CardHeader>
          <CardTitle>Duration Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => toast.success("Toast ngắn (2s)", { duration: 2000 })}
              variant="outline"
              className="w-full"
            >
              2s Duration
            </Button>
            
            <Button 
              onClick={() => toast.success("Toast dài (10s)", { duration: 10000 })}
              variant="outline"
              className="w-full"
            >
              10s Duration
            </Button>
            
            <Button 
              onClick={() => toast.success("Toast vĩnh viễn", { duration: Infinity })}
              variant="outline"
              className="w-full"
            >
              Infinite Duration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
