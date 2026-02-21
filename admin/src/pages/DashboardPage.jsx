import { useQuery } from "@tanstack/react-query";
import { orderApi, statsApi } from "../lib/api.js";
import {
  ShoppingBagIcon,
  UsersIcon,
  PackageIcon,
  DollarSignIcon,
} from "lucide-react";
function DashboardPage() {
  const { data: orderData, isLoading: orderLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAll,
  });
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: statsApi.getDashboard,
  });
  const recentOrders = orderData?.orders?.slice(0, 5) || [];
  const getOrderStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "badge-warning";
      case "processing":
        return "badge-info";
      case "shipped":
        return "badge-primary";
      case "delivered":
        return "badge-success";
      case "cancelled":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };
  const capitalizeText = (text) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "";
  const statsCards = [
    {
      name: "Total Revenue",
      value: statsLoading
        ? "..."
        : `$${(statsData?.totalRevenue ?? 0).toFixed(2)}`,
      icon: <DollarSignIcon className="size-8" />,
    },
    {
      name: "Total Orders",
      value: statsLoading ? "..." : statsData?.totalOrders ?? 0,
      icon: <ShoppingBagIcon className="size-8" />,
    },
    {
      name: "Total Customers",
      value: statsLoading ? "..." : statsData?.totalCustomers ?? 0,
      icon: <UsersIcon className="size-8" />,
    },
    {
      name: "Total Products",
      value: statsLoading ? "..." : statsData?.totalProducts ?? 0,
      icon: <PackageIcon className="size-8" />,
    },
  ];
  return (
    <div className="space-y-6">
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100">
        {statsCards.map((stat) => (
          <div key={stat.name} className="stat">
            <div className="stat-figure text-primary">{stat.icon}</div>
            <div className="stat-title">{stat.name}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Recent Orders</h2>
          {orderLoading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8 text-base-content/60">
              No Orders Yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <span className="font-medium">
                          #{order._id?.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">
                            {order.shippingAddress?.fullName}
                          </div>
                          <div className="text-sm opacity-60">
                            {order.orderItems?.length || 0} item(s)
                          </div>
                        </div>
                      </td>
                      <td>
                        {order.orderItems?.[0]?.name}
                        {order.orderItems?.length > 1 &&
                          ` +${order.orderItems.length - 1} more`}
                      </td>
                      <td>
                        <span className="font-semibold">
                          ${(order.totalPrice ?? 0).toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <div
                          className={`badge ${getOrderStatusBadge(
                            order.status
                          )}`}
                        >
                          {capitalizeText(order.status)}
                        </div>
                      </td>
                      <td>
                        <span className="text-sm opacity-60">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;