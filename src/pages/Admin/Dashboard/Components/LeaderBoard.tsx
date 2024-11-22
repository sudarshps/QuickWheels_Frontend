import React, { useEffect, useState } from 'react'
import axios from '../../../../api/axios'
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "../../../../components/ui/table";

interface LeaderBoardFCProps{
  hostName:string;
  totalOrders:number;
  totalRevenue:number;
}

const LeaderBoard:React.FC = () => {
      const[leaderBoard,setLeaderboard] = useState<LeaderBoardFCProps[]>([])

      useEffect(()=>{
        axios.get('/leaderboardorder')
        .then(res=>{
          setLeaderboard(res.data)
        })
      },[])
      
  return (
    <div className="text-white">
  <h3 className="font-semibold mb-4 text-lg md:text-xl">Leaderboard Of Renters</h3>
  <div className="overflow-x-auto">
    <Table className="min-w-full rounded-lg">
      <TableHeader>
        <TableRow className="border-b">
          <TableHead className="px-4 py-2 text-sm md:text-base">Rank</TableHead>
          <TableHead className="px-4 py-2 text-sm md:text-base">Host</TableHead>
          <TableHead className="px-4 py-2 text-sm md:text-base text-right">
            Orders
          </TableHead>
          <TableHead className="px-4 py-2 text-sm md:text-base text-right">
            Total Revenue
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaderBoard.map((host, index) => (
          <TableRow key={index} className="border-b">
            <TableCell className="px-4 py-3 text-sm md:text-base">
              {index + 1}
            </TableCell>
            <TableCell className="px-4 py-3 flex items-center gap-3 text-sm md:text-base">
              <span>{host.hostName}</span>
            </TableCell>
            <TableCell className="px-4 py-3 text-right text-sm md:text-base">
              {host.totalOrders}
            </TableCell>
            <TableCell className="px-4 py-3 text-right text-sm md:text-base text-green-500">
              ₹{host.totalRevenue - host.totalOrders * (1500 + 149)}.00
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
</div>

  )
}

export default LeaderBoard
