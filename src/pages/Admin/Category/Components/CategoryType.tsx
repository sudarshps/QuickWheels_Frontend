import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import axios from "../../../../api/axios";
import {
  Pagination as PaginationMain,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../../components/ui/pagination";

type Category = {
  _id: string;
  name: string;
};

interface CategoryTypeProps{
  activeCategory:string;
  handleAlert: (action: boolean | null, message: string) => void;
}

interface CategoryProps{
  name:string;
  _id:string;
}

export default function CategoryType({ activeCategory, handleAlert }:CategoryTypeProps) {
  const [makeCategories, setMakeCategories] = useState<CategoryProps[]>([]);
  const [typeCategories, setTypeCategories] = useState<CategoryProps[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,setTotalPages] = useState(0)

  useEffect(() => {
    if (activeCategory === "make") {
      axios.get("/getmakecategory",{
        params:{
          page:currentPage
        }
      }).then((res) => {  
        setTotalPages(res.data.totalPages)     
        setMakeCategories(res.data.data);
      });
    } else {
      axios.get("/gettypecategory",{
        params:{
          page:currentPage
        }
      }).then((res) => {
        setTotalPages(res.data.totalPages)     
        setTypeCategories(res.data.data);
      });
    }
  }, [activeCategory,refresh,currentPage]);

  useEffect(()=>{
    setCurrentPage(1)
  },[activeCategory])

  const addCategory = () => {
    if (newCategory.trim() === "") {
      setError("Category name cannot be empty!");
      return;
    }
    if (activeCategory === "make") {
      axios.post("/addmakecategory", { newCategory }).then((res) => {
        if (res.data === null) {
          handleAlert(null, "Category Exists!");
        } else if (res.data.categoryAdded) {
          handleAlert(true, res.data.message);
        } else {
          handleAlert(false, res.data.message);
        }
        setTimeout(() => {
          setRefresh((prev) => !prev);
        }, 3000);
      });
    } else {
      axios.post("/addtypecategory", { newCategory }).then((res) => {
        if (res.data === null) {
          handleAlert(null, "Category Exists!");
        } else if (res.data.categoryAdded) {
          handleAlert(true, res.data.message);
        } else {
          handleAlert(false, res.data.message);
        }
        setTimeout(() => {
          setRefresh((prev) => !prev);
        }, 3000);
      });
    }
    setNewCategory("");
    setError("");
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category);
    setNewCategory(category.name);
    setCategoryId(category._id);
  };

  const saveEdit = () => {
    if (newCategory.trim() === "") {
      setError("Category name cannot be empty!");
      return;
    }
    if (activeCategory === "make") {
      axios
        .put("/updatemakecategory", { newCategory, categoryId })
        .then((res) => {
          if (res.data === null) {
            handleAlert(null, "Category Exists!");
          } else if (res.data.categoryAdded) {
            handleAlert(true, res.data.message);
          } else {
            handleAlert(false, res.data.message);
          }
          setTimeout(() => {
            setRefresh((prev) => !prev);
          }, 3000);
        });
    } else {
      axios
        .put("/updatetypecategory", { newCategory, categoryId })
        .then((res) => {
          if (res.data === null) {
            handleAlert(null, "Category Exists!");
          } else if (res.data.categoryAdded) {
            handleAlert(true, res.data.message);
          } else {
            handleAlert(false, res.data.message);
          }
          setTimeout(() => {
            setRefresh((prev) => !prev);
          }, 3000);
        });
    }

    setEditingCategory(null);
    setNewCategory("");
    setError("");
  };

  const deleteCategory = (categoryId: string) => {
    if (activeCategory === "make") {
      axios
        .delete("/removemakecategory", {
          params: { categoryId },
        })
        .then((res) => {
          if (res.data.categoryRemoved) {
            handleAlert(true, res.data.message);
          } else {
            handleAlert(false, res.data.message);
          }
          setTimeout(() => {
            setRefresh((prev) => !prev);
          }, 3000);
        });
    } else {
      axios
        .delete("/removetypecategory", {
          params: { categoryId },
        })
        .then((res) => {
          if (res.data.categoryRemoved) {
            handleAlert(true, res.data.message);
          } else {
            handleAlert(false, res.data.message);
          }
          setTimeout(() => {
            setRefresh((prev) => !prev);
          }, 3000);
        });
    }
  };

  const handlePrevPage = () => {
    if(currentPage>1){
      setCurrentPage(currentPage-1)
    }
  }

  const handleNextPage = () => {
    if(currentPage<totalPages){
      setCurrentPage(currentPage+1)
    }
  }

  return (
    <Card className="w-full mx-auto bg-gradient-to-br from-[#10114f] to-[#1416b5] ms-0">
      <CardHeader>
        <CardTitle className="text-white">
          {activeCategory === "make" ? "Car Make" : "Car Type"}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-white">
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder={`New ${activeCategory} name`}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            {editingCategory ? (
              <Button onClick={saveEdit}>Save</Button>
            ) : (
              <Button className="bg-red-600" onClick={addCategory}>
                <Plus className="mr-2 h-4 w-4" /> Add {activeCategory}
              </Button>
            )}
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {activeCategory === "make" ? (
            <Table>
              {makeCategories.length ? (
                <TableHeader className="bg-white">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
              ) : null}

              <TableBody>
                {makeCategories.map((category, ind) => (
                  <TableRow key={ind}>
                    <TableCell>{ind + 1}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditing(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCategory(category._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              {typeCategories.length ? (
                <TableHeader className="bg-white">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
              ) : null}

              <TableBody>
                {typeCategories.map((category, ind) => (
                  <TableRow key={ind}>
                    <TableCell>{ind + 1}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditing(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCategory(category._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {totalPages>1?<PaginationMain>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={handlePrevPage}/>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>{currentPage}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext onClick={handleNextPage}/>
              </PaginationItem>
            </PaginationContent>
          </PaginationMain>:''}
        </div>
      </CardContent>
    </Card>
  );
}
