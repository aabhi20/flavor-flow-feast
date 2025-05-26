
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Orders = () => {
  const { currentUser } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', currentUser?.uid],
    queryFn: async () => {
      if (!currentUser) return [];
      
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },
    enabled: !!currentUser,
  });

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to view your orders.</p>
            <Link to="/login">
              <Button className="bg-orange-500 hover:bg-orange-600">Log In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping!</p>
            <Link to="/browse">
              <Button className="bg-orange-500 hover:bg-orange-600">Browse Meals</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Clock className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

        <div className="space-y-6">
          {orders.map((order: any) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </CardTitle>
                    <p className="text-gray-600">
                      {order.createdAt?.toDate?.()?.toLocaleDateString() || 'Recent'}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items?.map((item: any) => (
                    <div key={item.idMeal} className="flex items-center space-x-3">
                      <img
                        src={item.strMealThumb}
                        alt={item.strMeal}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.strMeal}</p>
                        <p className="text-gray-600 text-sm">
                          Qty: {item.quantity} × ${item.price}
                        </p>
                      </div>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery Address */}
                {order.deliveryAddress && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <h4 className="font-medium mb-1">Delivery Address</h4>
                    <p className="text-sm text-gray-600">
                      {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                    </p>
                  </div>
                )}

                {/* Order Summary */}
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-medium">Total Amount</span>
                  <span className="text-lg font-bold text-orange-500">
                    ${order.totalAmount?.toFixed(2) || '0.00'}
                  </span>
                </div>

                {order.status === 'confirmed' && (
                  <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-800">
                      🚀 Your order is being prepared and will be delivered soon!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
