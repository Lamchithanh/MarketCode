import { supabaseServiceRole } from '@/lib/supabase-server';

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName?: string;
  buyerEmail?: string;
  totalAmount: number;
  discountAmount?: number;
  taxAmount?: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentId?: string;
  notes?: string;
  itemCount?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  snapshotUrl?: string;
  createdAt: string;
}

export interface CreateOrderData {
  buyerId: string;
  totalAmount: number;
  discountAmount?: number;
  taxAmount?: number;
  paymentMethod: string;
  notes?: string;
  items: {
    productId: string;
    productTitle: string;
    productPrice: number;
    snapshotUrl?: string;
  }[];
}

export interface UpdateOrderData {
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMethod?: string;
  paymentId?: string;
  notes?: string;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  search?: string;
  buyerId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
}

export interface PaginatedOrders {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class OrderService {
  private static instance: OrderService;

  static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  /**
   * Get all orders with pagination and filtering
   */
  async getOrders(filters: OrderFilters = {}): Promise<PaginatedOrders> {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        paymentStatus,
        search,
        buyerId,
        dateFrom,
        dateTo,
      } = filters;

      const offset = (page - 1) * limit;

      // Build query
      let query = supabaseServiceRole
        .from('Order')
        .select(`
          *,
          User!Order_buyerId_fkey(name, email),
          OrderItem(id)
        `, { count: 'exact' })
        .is('deletedAt', null);

      // Apply filters
      if (status) {
        query = query.eq('status', status);
      }

      if (paymentStatus) {
        query = query.eq('paymentStatus', paymentStatus);
      }

      if (buyerId) {
        query = query.eq('buyerId', buyerId);
      }

      if (search) {
        query = query.or(`orderNumber.ilike.%${search}%`);
      }

      if (dateFrom) {
        query = query.gte('createdAt', dateFrom);
      }

      if (dateTo) {
        query = query.lte('createdAt', dateTo);
      }

      // Apply pagination and sorting
      query = query
        .order('createdAt', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`Failed to fetch orders: ${error.message}`);
      }

      // Format orders with buyer info and item count
      const orders: Order[] = (data || []).map((order: {
        id: string;
        orderNumber: string;
        buyerId: string;
        totalAmount: string;
        discountAmount?: string;
        taxAmount?: string;
        status: string;
        paymentMethod: string;
        paymentStatus: string;
        paymentId?: string;
        notes?: string;
        createdAt: string;
        updatedAt: string;
        deletedAt?: string;
        User?: { name?: string; email?: string };
        OrderItem?: { id: string }[];
      }) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        buyerId: order.buyerId,
        buyerName: order.User?.name || 'Unknown',
        buyerEmail: order.User?.email || 'Unknown',
        totalAmount: parseFloat(order.totalAmount),
        discountAmount: parseFloat(order.discountAmount || '0'),
        taxAmount: parseFloat(order.taxAmount || '0'),
        status: order.status as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED',
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus as 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED',
        paymentId: order.paymentId,
        notes: order.notes,
        itemCount: order.OrderItem?.length || 0,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        deletedAt: order.deletedAt,
      }));

      return {
        orders,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  /**
   * Get order by ID with items
   */
  async getOrderById(id: string): Promise<Order & { items: OrderItem[] }> {
    try {
      const { data, error } = await supabaseServiceRole
        .from('Order')
        .select(`
          *,
          User!Order_buyerId_fkey(name, email),
          OrderItem(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Failed to fetch order: ${error.message}`);
      }

      if (!data) {
        throw new Error('Order not found');
      }

      return {
        id: data.id,
        orderNumber: data.orderNumber,
        buyerId: data.buyerId,
        buyerName: data.User?.name || 'Unknown',
        buyerEmail: data.User?.email || 'Unknown',
        totalAmount: parseFloat(data.totalAmount),
        discountAmount: parseFloat(data.discountAmount || 0),
        taxAmount: parseFloat(data.taxAmount || 0),
        status: data.status,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus,
        paymentId: data.paymentId,
        notes: data.notes,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        deletedAt: data.deletedAt,
        items: data.OrderItem || [],
      };
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      throw error;
    }
  }

  /**
   * Create new order
   */
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Start transaction
      const { data: order, error: orderError } = await supabaseServiceRole
        .from('Order')
        .insert({
          orderNumber,
          buyerId: orderData.buyerId,
          totalAmount: orderData.totalAmount,
          discountAmount: orderData.discountAmount || 0,
          taxAmount: orderData.taxAmount || 0,
          paymentMethod: orderData.paymentMethod,
          notes: orderData.notes,
        })
        .select()
        .single();

      if (orderError) {
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      // Create order items
      if (orderData.items && orderData.items.length > 0) {
        const orderItems = orderData.items.map(item => ({
          orderId: order.id,
          productId: item.productId,
          productTitle: item.productTitle,
          productPrice: item.productPrice,
          snapshotUrl: item.snapshotUrl,
        }));

        const { error: itemsError } = await supabaseServiceRole
          .from('OrderItem')
          .insert(orderItems);

        if (itemsError) {
          // Rollback: delete the order
          await supabaseServiceRole.from('Order').delete().eq('id', order.id);
          throw new Error(`Failed to create order items: ${itemsError.message}`);
        }
      }

      // Fetch complete order data
      return await this.getOrderById(order.id);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Update order
   */
  async updateOrder(id: string, updateData: UpdateOrderData): Promise<Order> {
    try {
      console.log('OrderService.updateOrder - ID:', id, 'Data:', updateData);
      
      const { data, error } = await supabaseServiceRole
        .from('Order')
        .update({
          ...updateData,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw new Error(`Failed to update order: ${error.message}`);
      }

      if (!data) {
        console.error('No data returned from update');
        throw new Error('Order not found');
      }

      console.log('Order updated in database:', data);
      return await this.getOrderById(id);
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  /**
   * Delete order (soft delete)
   */
  async deleteOrder(id: string): Promise<void> {
    try {
      const { error } = await supabaseServiceRole
        .from('Order')
        .update({ deletedAt: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete order: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }

  /**
   * Get order statistics
   */
  async getOrderStats(): Promise<OrderStats> {
    try {
      // Get total orders and revenue
      const { data: orders, error: ordersError } = await supabaseServiceRole
        .from('Order')
        .select('totalAmount, status')
        .is('deletedAt', null);

      if (ordersError) {
        throw new Error(`Failed to fetch order stats: ${ordersError.message}`);
      }

      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0) || 0;
      const pendingOrders = orders?.filter(order => order.status === 'PENDING').length || 0;
      const completedOrders = orders?.filter(order => order.status === 'COMPLETED').length || 0;
      const cancelledOrders = orders?.filter(order => order.status === 'CANCELLED').length || 0;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      return {
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        averageOrderValue,
      };
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const orderService = OrderService.getInstance();
