'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  X, 
  Edit2, 
  Check, 
  User, 
  Mail, 
  Phone, 
  Building, 
  FileText,
  DollarSign,
  Clock,
  AlertCircle,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_text: string;
  duration: string;
  category: string;
  service_type: string;
  features: string[];
}

interface NewServiceRequestFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ServiceRequestFormData) => Promise<void>;
  loading?: boolean;
}

interface ServiceRequestFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service_id: string;
  title: string;
  description: string;
  budget_range: string;
  timeline: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requirements: string[];
  technical_specs: Record<string, string>;
}

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  icon?: React.ReactNode;
  label: string;
}

function EditableField({ value, onSave, placeholder, multiline = false, icon, label }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {icon}
        {label}
      </Label>
      
      {isEditing ? (
        <div className="space-y-2">
          {multiline ? (
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
              rows={3}
              className="w-full"
              autoFocus
            />
          ) : (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
              className="w-full"
              autoFocus
            />
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} className="h-8">
              <Check className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="h-8">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="group relative p-3 border rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
          onClick={() => setIsEditing(true)}
        >
          {value ? (
            <div className="text-sm">{value}</div>
          ) : (
            <div className="text-sm text-gray-400">{placeholder}</div>
          )}
          <Edit2 className="absolute top-2 right-2 h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </div>
  );
}

export function NewServiceRequestForm({ isOpen, onOpenChange, onSubmit, loading = false }: NewServiceRequestFormProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // Form data
  const [formData, setFormData] = useState<ServiceRequestFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    service_id: '',
    title: '',
    description: '',
    budget_range: '',
    timeline: '',
    priority: 'medium',
    requirements: [],
    technical_specs: {}
  });

  const [requirements, setRequirements] = useState<string[]>(['']);
  const [techSpecs, setTechSpecs] = useState<{key: string, value: string}[]>([{key: '', value: ''}]);

  // Load services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data.services || []);
        }
      } catch (error) {
        console.error('Error loading services:', error);
      }
    };

    if (isOpen) {
      fetchServices();
    }
  }, [isOpen]);

  // Handle service selection
  const handleServiceSelect = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    setSelectedService(service || null);
    setFormData(prev => ({
      ...prev,
      service_id: serviceId,
      title: service ? `Yêu cầu ${service.name}` : '',
      requirements: service ? service.features.slice(0, 3) : ['']
    }));
    setRequirements(service ? service.features.slice(0, 3) : ['']);
  };

  // Add requirement
  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  // Remove requirement
  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
    }
  };

  // Update requirement
  const updateRequirement = (index: number, value: string) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  // Add tech spec
  const addTechSpec = () => {
    setTechSpecs([...techSpecs, {key: '', value: ''}]);
  };

  // Remove tech spec
  const removeTechSpec = (index: number) => {
    if (techSpecs.length > 1) {
      setTechSpecs(techSpecs.filter((_, i) => i !== index));
    }
  };

  // Update tech spec
  const updateTechSpec = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...techSpecs];
    updated[index][field] = value;
    setTechSpecs(updated);
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.service_id || !formData.title || !formData.description) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Prepare data
    const submitData = {
      ...formData,
      requirements: requirements.filter(req => req.trim() !== ''),
      technical_specs: techSpecs.reduce((acc, spec) => {
        if (spec.key.trim() && spec.value.trim()) {
          acc[spec.key.trim()] = spec.value.trim();
        }
        return acc;
      }, {} as Record<string, string>)
    };

    try {
      await onSubmit(submitData);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service_id: '',
        title: '',
        description: '',
        budget_range: '',
        timeline: '',
        priority: 'medium',
        requirements: [],
        technical_specs: {}
      });
      setRequirements(['']);
      setTechSpecs([{key: '', value: ''}]);
      setSelectedService(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Tạo yêu cầu dịch vụ mới
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Selection */}
          <Card className="border-2 border-blue-200">
            <CardContent className="p-4">
              <Label className="text-sm font-semibold text-blue-700 mb-3 block">
                1. Chọn dịch vụ *
              </Label>
              <Select value={formData.service_id} onValueChange={handleServiceSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn dịch vụ cần hỗ trợ" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{service.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {service.category}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedService && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">{selectedService.description}</p>
                  <div className="flex gap-4 mt-2 text-xs text-blue-600">
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {selectedService.price_text}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {selectedService.duration}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardContent className="p-4">
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                2. Thông tin khách hàng
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <EditableField
                  value={formData.name}
                  onSave={(value) => setFormData(prev => ({...prev, name: value}))}
                  placeholder="Click để nhập họ tên *"
                  icon={<User className="h-4 w-4" />}
                  label="Họ và tên *"
                />
                <EditableField
                  value={formData.email}
                  onSave={(value) => setFormData(prev => ({...prev, email: value}))}
                  placeholder="Click để nhập email *"
                  icon={<Mail className="h-4 w-4" />}
                  label="Email *"
                />
                <EditableField
                  value={formData.phone}
                  onSave={(value) => setFormData(prev => ({...prev, phone: value}))}
                  placeholder="Click để nhập số điện thoại"
                  icon={<Phone className="h-4 w-4" />}
                  label="Số điện thoại"
                />
                <EditableField
                  value={formData.company}
                  onSave={(value) => setFormData(prev => ({...prev, company: value}))}
                  placeholder="Click để nhập tên công ty"
                  icon={<Building className="h-4 w-4" />}
                  label="Công ty/Tổ chức"
                />
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardContent className="p-4">
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                3. Chi tiết dự án
              </Label>
              <div className="space-y-4">
                <EditableField
                  value={formData.title}
                  onSave={(value) => setFormData(prev => ({...prev, title: value}))}
                  placeholder="Click để nhập tiêu đề dự án *"
                  icon={<FileText className="h-4 w-4" />}
                  label="Tiêu đề dự án *"
                />
                <EditableField
                  value={formData.description}
                  onSave={(value) => setFormData(prev => ({...prev, description: value}))}
                  placeholder="Click để nhập mô tả chi tiết dự án *"
                  multiline
                  label="Mô tả dự án *"
                />
                <div className="grid grid-cols-2 gap-4">
                  <EditableField
                    value={formData.budget_range}
                    onSave={(value) => setFormData(prev => ({...prev, budget_range: value}))}
                    placeholder="Ví dụ: 5-10 triệu VNĐ"
                    icon={<DollarSign className="h-4 w-4" />}
                    label="Ngân sách dự kiến"
                  />
                  <EditableField
                    value={formData.timeline}
                    onSave={(value) => setFormData(prev => ({...prev, timeline: value}))}
                    placeholder="Ví dụ: 2-3 tuần"
                    icon={<Clock className="h-4 w-4" />}
                    label="Thời gian mong muốn"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Độ ưu tiên
                  </Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value: ServiceRequestFormData['priority']) => setFormData(prev => ({...prev, priority: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Thấp</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="high">Cao</SelectItem>
                      <SelectItem value="urgent">Khẩn cấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-semibold text-gray-700">
                  4. Yêu cầu chức năng
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRequirement}
                  className="h-8"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Thêm yêu cầu
                </Button>
              </div>
              <div className="space-y-2">
                {requirements.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={req}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      placeholder={`Yêu cầu ${index + 1}...`}
                      className="flex-1"
                    />
                    {requirements.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeRequirement(index)}
                        className="h-10 w-10 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-semibold text-gray-700">
                  5. Thông số kỹ thuật (tùy chọn)
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTechSpec}
                  className="h-8"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Thêm thông số
                </Button>
              </div>
              <div className="space-y-2">
                {techSpecs.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={spec.key}
                      onChange={(e) => updateTechSpec(index, 'key', e.target.value)}
                      placeholder="Tên thông số..."
                      className="w-1/3"
                    />
                    <Input
                      value={spec.value}
                      onChange={(e) => updateTechSpec(index, 'value', e.target.value)}
                      placeholder="Giá trị..."
                      className="flex-1"
                    />
                    {techSpecs.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTechSpec(index)}
                        className="h-10 w-10 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button 
              type="submit"
              disabled={loading || !formData.name || !formData.email || !formData.service_id || !formData.title || !formData.description}
            >
              {loading ? 'Đang tạo...' : 'Tạo yêu cầu'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
