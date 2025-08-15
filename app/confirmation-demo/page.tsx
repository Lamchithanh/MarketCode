"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ConfirmationModal,
  DeleteConfirmationModal,
  LogoutConfirmationModal,
  UnsavedChangesModal,
  ActionConfirmationModal,
  useConfirmationModal,
} from "@/components/ui/confirmation-modal";

export default function ConfirmationDemoPage() {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);

  const { confirm, modalProps } = useConfirmationModal();

  const handleCustomConfirm = async () => {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Custom action confirmed!");
  };

  const handleDeleteConfirm = async () => {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Item deleted!");
  };

  const handleLogoutConfirm = async () => {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("User logged out!");
  };

  const handleUnsavedConfirm = async () => {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("User left page!");
  };

  const handleActionConfirm = async () => {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Action executed!");
  };

  const handleHookConfirm = async () => {
    const result = await confirm({
      title: "Hook Confirmation",
      description: "This is a confirmation using the useConfirmationModal hook",
      type: "info",
      confirmText: "Proceed",
      cancelText: "Cancel",
      onConfirm: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Hook action confirmed!");
      },
    });
    
    if (result) {
      console.log("User confirmed via hook!");
    } else {
      console.log("User cancelled via hook!");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Confirmation Modal Demo</h1>
        <p className="text-muted-foreground">Demo các loại confirmation modal mới</p>
      </div>

      {/* Basic Confirmation Modal */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Confirmation Modal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Modal xác nhận cơ bản với các loại khác nhau
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setShowCustomModal(true)} variant="default">
              Default Modal
            </Button>
            <Button onClick={() => setShowCustomModal(true)} variant="outline">
              Warning Modal
            </Button>
            <Button onClick={() => setShowCustomModal(true)} variant="destructive">
              Danger Modal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Predefined Modals */}
      <Card>
        <CardHeader>
          <CardTitle>Predefined Modals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Các modal được định nghĩa sẵn cho các trường hợp phổ biến
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Delete Confirmation</h4>
              <Button 
                onClick={() => setShowDeleteModal(true)} 
                variant="destructive" 
                size="sm"
              >
                Xóa sản phẩm
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Logout Confirmation</h4>
              <Button 
                onClick={() => setShowLogoutModal(true)} 
                variant="outline" 
                size="sm"
              >
                Đăng xuất
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Unsaved Changes</h4>
              <Button 
                onClick={() => setShowUnsavedModal(true)} 
                variant="outline" 
                size="sm"
              >
                Rời khỏi trang
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Custom Action</h4>
              <Button 
                onClick={() => setShowActionModal(true)} 
                variant="default" 
                size="sm"
              >
                Thực hiện hành động
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hook Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Hook Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Sử dụng hook useConfirmationModal để tạo modal động
          </p>
          <Button onClick={handleHookConfirm} variant="secondary">
            Hook Confirmation
          </Button>
        </CardContent>
      </Card>

      {/* Modal Instances */}
      
      {/* Custom Modal */}
      <ConfirmationModal
        open={showCustomModal}
        onOpenChange={setShowCustomModal}
        title="Xác nhận hành động"
        description="Bạn có chắc chắn muốn thực hiện hành động này?"
        type="warning"
        confirmText="Thực hiện"
        cancelText="Hủy"
        onConfirm={handleCustomConfirm}
      />

      {/* Delete Modal */}
      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        itemName="Sản phẩm ABC"
        onConfirm={handleDeleteConfirm}
      />

      {/* Logout Modal */}
      <LogoutConfirmationModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={handleLogoutConfirm}
      />

      {/* Unsaved Changes Modal */}
      <UnsavedChangesModal
        open={showUnsavedModal}
        onOpenChange={setShowUnsavedModal}
        onConfirm={handleUnsavedConfirm}
        onCancel={() => console.log("User chose to stay")}
      />

      {/* Action Modal */}
      <ActionConfirmationModal
        open={showActionModal}
        onOpenChange={setShowActionModal}
        title="Xác nhận thực hiện"
        description="Hành động này sẽ thay đổi trạng thái hệ thống. Bạn có chắc chắn?"
        actionText="Thực hiện"
        type="info"
        onConfirm={handleActionConfirm}
      />

      {/* Hook Modal */}
      <ConfirmationModal {...modalProps} />
    </div>
  );
}
