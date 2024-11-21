import React from "react"

interface OrderStatusProps{
    active:number;
    completed:number;
    upcoming:number;
}


export const OrderStatusChart:React.FC<OrderStatusProps> = ({active,completed,upcoming}) => {

    const total = active+completed+upcoming

    const activePercentage = (active/total) * 100
    const completedPercentage = (completed/total) * 100

    return (
        <div className="bg-white p-6 rounded-lg w-80 shadow">
          <h3 className="text-lg font-semibold mb-4">Order Status</h3>
          <div className="relative h-56 w-56 mx-auto">
            {/* Pie chart using conic-gradient */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(
                  #3b82f6 ${activePercentage}%,
                  #f59e0b ${activePercentage}% ${activePercentage + completedPercentage}%,
                  #10b981 ${activePercentage + completedPercentage}% 100%
                )`,
              }}
            />
          </div>
              
          <div className="text-center">
                <div className="font-semibold">TOTAL ORDER</div>
                <div className="text-xl font-bold">{total}</div>
              </div>

          {/* Legend */}
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Upcoming</span>
            </div>
          </div>
        </div>
      );
}