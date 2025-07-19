// Purchase tracking service
export interface ProductPurchase {
  id: string;
  userId: string;
  productId: number;
  productName: string;
  amount: number;
  timestamp: Date;
  status: 'active' | 'completed';
}

export interface PurchaseLimit {
  productId: number;
  maxPurchases: number; // -1 for unlimited
}

class PurchaseService {
  private readonly PURCHASE_LIMITS: PurchaseLimit[] = [
    { productId: 1, maxPurchases: 1 }, // Solar Mini (KSh 200) - max 1 time
    { productId: 2, maxPurchases: 1 }, // Solar Micro (KSh 500) - max 1 time
    { productId: 3, maxPurchases: -1 }, // Solar Starter - unlimited
    { productId: 4, maxPurchases: -1 }, // Solar Basic - unlimited
    { productId: 5, maxPurchases: -1 }, // Solar Standard - unlimited
    { productId: 6, maxPurchases: -1 }, // Solar Premium - unlimited
    { productId: 7, maxPurchases: -1 }, // Solar Gold - unlimited
    { productId: 8, maxPurchases: -1 }, // Solar Platinum - unlimited
    { productId: 9, maxPurchases: -1 }, // Solar Diamond - unlimited
    { productId: 10, maxPurchases: -1 }, // Solar Elite - unlimited
    { productId: 11, maxPurchases: -1 }, // Solar VIP - unlimited
    { productId: 12, maxPurchases: -1 }, // Solar Ultimate - unlimited
  ];

  // Get user purchases
  getUserPurchases(userId: string): ProductPurchase[] {
    const purchases = localStorage.getItem('solar_user_purchases');
    const allPurchases: ProductPurchase[] = purchases ? JSON.parse(purchases) : [];
    return allPurchases.filter(p => p.userId === userId);
  }

  // Save purchases
  private savePurchases(purchases: ProductPurchase[]): void {
    localStorage.setItem('solar_user_purchases', JSON.stringify(purchases));
  }

  // Get all purchases (for admin)
  getAllPurchases(): ProductPurchase[] {
    const purchases = localStorage.getItem('solar_user_purchases');
    return purchases ? JSON.parse(purchases) : [];
  }

  // Check if user can purchase a product
  canPurchaseProduct(userId: string, productId: number): { canPurchase: boolean; reason?: string; currentCount: number; maxAllowed: number } {
    const limit = this.PURCHASE_LIMITS.find(l => l.productId === productId);
    
    if (!limit) {
      return { canPurchase: true, currentCount: 0, maxAllowed: -1 };
    }

    if (limit.maxPurchases === -1) {
      return { canPurchase: true, currentCount: 0, maxAllowed: -1 };
    }

    const userPurchases = this.getUserPurchases(userId);
    const productPurchases = userPurchases.filter(p => p.productId === productId);
    const currentCount = productPurchases.length;

    if (currentCount >= limit.maxPurchases) {
      return {
        canPurchase: false,
        reason: `You have reached the maximum purchase limit for this product (${limit.maxPurchases} time${limit.maxPurchases > 1 ? 's' : ''})`,
        currentCount,
        maxAllowed: limit.maxPurchases
      };
    }

    return { canPurchase: true, currentCount, maxAllowed: limit.maxPurchases };
  }

  // Record a purchase
  recordPurchase(
    userId: string,
    productId: number,
    productName: string,
    amount: number
  ): { success: boolean; purchaseId?: string; message: string } {
    const canPurchase = this.canPurchaseProduct(userId, productId);
    
    if (!canPurchase.canPurchase) {
      return {
        success: false,
        message: canPurchase.reason || 'Purchase not allowed'
      };
    }

    const purchaseId = `PUR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const purchase: ProductPurchase = {
      id: purchaseId,
      userId,
      productId,
      productName,
      amount,
      timestamp: new Date(),
      status: 'active'
    };

    const allPurchases = this.getAllPurchases();
    allPurchases.unshift(purchase);
    this.savePurchases(allPurchases);

    return {
      success: true,
      purchaseId,
      message: 'Purchase recorded successfully'
    };
  }

  // Get purchase limits for display
  getPurchaseLimit(productId: number): PurchaseLimit | null {
    return this.PURCHASE_LIMITS.find(l => l.productId === productId) || null;
  }

  // Get purchase count for a specific product
  getPurchaseCount(userId: string, productId: number): number {
    const userPurchases = this.getUserPurchases(userId);
    return userPurchases.filter(p => p.productId === productId).length;
  }
}

export const purchaseService = new PurchaseService();