import React from 'react'
import { Pagination as PaginationMain,
    PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
 } from '../ui/pagination'
  

const PaginationCat:React.FC = () => {  

  return (
    <PaginationMain>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious href="#" />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#">1</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationEllipsis />
      </PaginationItem>
      <PaginationItem>
        <PaginationNext href="#" />
      </PaginationItem>
    </PaginationContent>
  </PaginationMain>
  

    
  )
}

export default PaginationCat
