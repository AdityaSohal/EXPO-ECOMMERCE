// import { useState } from "react";
// import { PlusIcon, PencilIcon, Trash2Icon, XIcon, ImageIcon } from "lucide-react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { productApi } from "../lib/api";
// import { getStockStatusBadge } from "../lib/utils";

// function ProductsPage() {
//   const [showModal, setShowModal] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     category: "",
//     price: "",
//     stock: "",
//     description: "",
//   });
//   const [images, setImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);

//   // FIX: track which product is currently being deleted
//   const [deletingId, setDeletingId] = useState(null);

//   const queryClient = useQueryClient();

//   const { data } = useQuery({
//     queryKey: ["products"],
//     queryFn: productApi.getAll,
//   });
//   const products = data?.products || [];

//   const createProductMutation = useMutation({
//     mutationFn: productApi.create,
//     onSuccess: () => {
//       closeModal();
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//     },
//   });

//   const updateProductMutation = useMutation({
//     mutationFn: productApi.update,
//     onSuccess: () => {
//       closeModal();
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//     },
//   });

//   const deleteProductMutation = useMutation({
//     mutationFn: productApi.delete,
//     onSuccess: () => {
//       // FIX: clear deletingId after successful delete
//       setDeletingId(null);
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//     },
//     onError: () => {
//       // FIX: also clear deletingId on error so UI doesn't get stuck
//       setDeletingId(null);
//     },
//   });

//   const closeModal = () => {
//     setShowModal(false);
//     setEditingProduct(null);
//     setFormData({
//       name: "",
//       category: "",
//       price: "",
//       stock: "",
//       description: "",
//     });
//     setImages([]);
//     setImagePreviews([]);
//   };

//   const handleEdit = (product) => {
//     setEditingProduct(product);
//     setFormData({
//       name: product.name,
//       category: product.category,
//       price: product.price.toString(),
//       stock: product.stock.toString(),
//       description: product.description,
//     });
//     setImagePreviews(product.images);
//     setShowModal(true);
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 3) return alert("Maximum 3 images allowed");

//     imagePreviews.forEach((url) => {
//       if (url.startsWith("blob:")) URL.revokeObjectURL(url);
//     });

//     setImages(files);
//     setImagePreviews(files.map((file) => URL.createObjectURL(file)));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!editingProduct && imagePreviews.length === 0) {
//       return alert("Please upload at least one image");
//     }

//     const formDataToSend = new FormData();
//     formDataToSend.append("name", formData.name);
//     formDataToSend.append("description", formData.description);
//     formDataToSend.append("price", formData.price);
//     formDataToSend.append("stock", formData.stock);
//     formDataToSend.append("category", formData.category);

//     if (images.length > 0) images.forEach((image) => formDataToSend.append("images", image));

//     if (editingProduct) {
//       updateProductMutation.mutate({ id: editingProduct._id, formData: formDataToSend });
//     } else {
//       createProductMutation.mutate(formDataToSend);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* HEADER */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">Products</h1>
//           <p className="text-base-content/70 mt-1">Manage your product inventory</p>
//         </div>
//         <button onClick={() => setShowModal(true)} className="btn btn-primary gap-2">
//           <PlusIcon className="w-5 h-5" />
//           Add Product
//         </button>
//       </div>

//       {/* FIX: Added empty state when no products exist */}
//       {products.length === 0 ? (
//         <div className="text-center py-16 text-base-content/60">
//           <p className="text-xl font-semibold mb-2">No products yet</p>
//           <p className="text-sm">Click "Add Product" to get started</p>
//         </div>
//       ) : (
//         /* PRODUCTS GRID */
//         <div className="grid grid-cols-1 gap-4">
//           {products.map((product) => {
//             const status = getStockStatusBadge(product.stock);

//             return (
//               <div key={product._id} className="card bg-base-100 shadow-xl">
//                 <div className="card-body">
//                   <div className="flex items-center gap-6">
//                     <div className="avatar">
//                       <div className="w-20 rounded-xl">
//                         <img src={product.images[0]} alt={product.name} />
//                       </div>
//                     </div>

//                     <div className="flex-1">
//                       <div className="flex items-start justify-between">
//                         <div>
//                           <h3 className="card-title">{product.name}</h3>
//                           <p className="text-base-content/70 text-sm">{product.category}</p>
//                         </div>
//                         <div className={`badge ${status.class}`}>{status.text}</div>
//                       </div>
//                       <div className="flex items-center gap-6 mt-4">
//                         <div>
//                           <p className="text-xs text-base-content/70">Price</p>
//                           <p className="font-bold text-lg">${product.price}</p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-base-content/70">Stock</p>
//                           <p className="font-bold text-lg">{product.stock} units</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="card-actions">
//                       <button
//                         className="btn btn-square btn-ghost"
//                         onClick={() => handleEdit(product)}
//                       >
//                         <PencilIcon className="w-5 h-5" />
//                       </button>
//                       <button
//                         className="btn btn-square btn-ghost text-error"
//                         onClick={() => {
//                           // FIX: set deletingId to THIS product's id before mutating
//                           setDeletingId(product._id);
//                           deleteProductMutation.mutate(product._id);
//                         }}
//                         disabled={deletingId === product._id}
//                       >
//                         {/* FIX: spinner only shows on the product being deleted */}
//                         {deletingId === product._id ? (
//                           <span className="loading loading-spinner"></span>
//                         ) : (
//                           <Trash2Icon className="w-5 h-5" />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* ADD/EDIT PRODUCT MODAL */}
//       {/* FIX: removed the broken/redundant modal-toggle checkbox input entirely */}
//       <div className={`modal ${showModal ? "modal-open" : ""}`}>
//         <div className="modal-box max-w-2xl">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="font-bold text-2xl">
//               {editingProduct ? "Edit Product" : "Add New Product"}
//             </h3>

//             <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost">
//               <XIcon className="w-5 h-5" />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="form-control">
//                 <label className="label">
//                   <span>Product Name</span>
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter product name"
//                   className="input input-bordered"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   required
//                 />
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span>Category</span>
//                 </label>
//                 <select
//                   className="select select-bordered"
//                   value={formData.category}
//                   onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                   required
//                 >
//                   <option value="">Select category</option>
//                   <option value="Electronics">Electronics</option>
//                   <option value="Accessories">Accessories</option>
//                   <option value="Fashion">Fashion</option>
//                   <option value="Sports">Sports</option>
//                 </select>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="form-control">
//                 <label className="label">
//                   <span>Price ($)</span>
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   placeholder="0.00"
//                   className="input input-bordered"
//                   value={formData.price}
//                   onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                   required
//                 />
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span>Stock</span>
//                 </label>
//                 <input
//                   type="number"
//                   placeholder="0"
//                   className="input input-bordered"
//                   value={formData.stock}
//                   onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="form-control flex flex-col gap-2">
//               <label className="label">
//                 <span>Description</span>
//               </label>
//               <textarea
//                 className="textarea textarea-bordered h-24 w-full"
//                 placeholder="Enter product description"
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 required
//               />
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold text-base flex items-center gap-2">
//                   <ImageIcon className="h-5 w-5" />
//                   Product Images
//                 </span>
//                 <span className="label-text-alt text-xs opacity-60">Max 3 images</span>
//               </label>

//               <div className="bg-base-200 rounded-xl p-4 border-2 border-dashed border-base-300 hover:border-primary transition-colors">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={handleImageChange}
//                   className="file-input file-input-bordered file-input-primary w-full"
//                   required={!editingProduct}
//                 />

//                 {editingProduct && (
//                   <p className="text-xs text-base-content/60 mt-2 text-center">
//                     Leave empty to keep current images
//                   </p>
//                 )}
//               </div>

//               {imagePreviews.length > 0 && (
//                 <div className="flex gap-2 mt-2">
//                   {imagePreviews.map((preview, index) => (
//                     <div key={index} className="avatar">
//                       <div className="w-20 rounded-lg">
//                         <img src={preview} alt={`Preview ${index + 1}`} />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="modal-action">
//               <button
//                 type="button"
//                 onClick={closeModal}
//                 className="btn"
//                 disabled={createProductMutation.isPending || updateProductMutation.isPending}
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 className="btn btn-primary"
//                 disabled={createProductMutation.isPending || updateProductMutation.isPending}
//               >
//                 {createProductMutation.isPending || updateProductMutation.isPending ? (
//                   <span className="loading loading-spinner"></span>
//                 ) : editingProduct ? (
//                   "Update Product"
//                 ) : (
//                   "Add Product"
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//         {/* Click outside to close */}
//         <div className="modal-backdrop" onClick={closeModal} />
//       </div>
//     </div>
//   );
// }

// export default ProductsPage;
import { useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  XIcon,
  ImageIcon,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../lib/api";
import { getStockStatusBadge } from "../lib/utils";

function ProductsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAll,
  });

  const products = data?.products || [];

  const createProductMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: productApi.update,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      setDeletingId(null);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      setDeletingId(null);
    },
  });

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
    });
    setImages([]);
    setImagePreviews([]);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
    });
    setImagePreviews(product.images);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) return alert("Maximum 3 images allowed");

    imagePreviews.forEach((url) => {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    });

    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editingProduct && imagePreviews.length === 0) {
      return alert("Please upload at least one image");
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("category", formData.category);

    if (images.length > 0) {
      images.forEach((image) =>
        formDataToSend.append("images", image)
      );
    }

    if (editingProduct) {
      updateProductMutation.mutate({
        id: editingProduct._id,
        formData: formDataToSend,
      });
    } else {
      createProductMutation.mutate(formDataToSend);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-base-content/70 mt-1">
            Manage your product inventory
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* EMPTY STATE */}
      {products.length === 0 ? (
        <div className="text-center py-16 text-base-content/60">
          <p className="text-xl font-semibold mb-2">No products yet</p>
          <p className="text-sm">Click "Add Product" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => {
            const status = getStockStatusBadge(product.stock);

            return (
              <div
                key={product._id}
                className="card bg-base-100 shadow-md"
              >
                <div className="card-body">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* IMAGE */}
                    <div className="avatar">
                      <div className="w-20 rounded-xl">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                        />
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <h3 className="card-title">
                            {product.name}
                          </h3>
                          <p className="text-base-content/70 text-sm">
                            {product.category}
                          </p>
                        </div>

                        <div
                          className={`badge ${status.class} whitespace-nowrap`}
                        >
                          {status.text}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
                        <div>
                          <p className="text-xs text-base-content/70">
                            Price
                          </p>
                          <p className="font-bold text-lg">
                            ${product.price}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-base-content/70">
                            Stock
                          </p>
                          <p className="font-bold text-lg">
                            {product.stock} units
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* SAFER ACTIONS */}
                    <div className="flex items-center gap-3 self-start sm:self-center">
                      {/* EDIT */}
                      <button
                        className="btn btn-sm btn-outline btn-primary"
                        onClick={() => handleEdit(product)}
                      >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Edit
                      </button>

                      {/* DELETE */}
                      <button
                        className="btn btn-sm btn-ghost text-error hover:bg-error/10"
                        onClick={() => {
                          const confirmDelete = window.confirm(
                            "Are you sure you want to delete this product?"
                          );
                          if (!confirmDelete) return;

                          setDeletingId(product._id);
                          deleteProductMutation.mutate(product._id);
                        }}
                        disabled={deletingId === product._id}
                      >
                        {deletingId === product._id ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          <>
                            <Trash2Icon className="w-4 h-4 mr-1" />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      <div className={`modal ${showModal ? "modal-open" : ""}`}>
        <div className="modal-box max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-2xl">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>

            <button
              onClick={closeModal}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Product Name"
                className="input input-bordered"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <select
                className="select select-bordered"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              >
                <option value="">Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Fashion">Fashion</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                className="input input-bordered"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder="Stock"
                className="input input-bordered"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                required
              />
            </div>

            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              required
            />

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full"
              required={!editingProduct}
            />

            {imagePreviews.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="avatar">
                    <div className="w-20 rounded-lg">
                      <img src={preview} alt="Preview" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="modal-action">
              <button type="button" onClick={closeModal} className="btn">
                Cancel
              </button>

              <button type="submit" className="btn btn-primary">
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>

        <div className="modal-backdrop" onClick={closeModal} />
      </div>
    </div>
  );
}

export default ProductsPage;