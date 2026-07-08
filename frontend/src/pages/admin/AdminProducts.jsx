// frontend/src/AdminProducts.jsx

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { productService } from '../../services';
import { Icons } from '../../icons';

function AdminProducts() {
  const { token } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    comparePrice: '',
    stock: '',
    images: '',
    colors: '',
    sizes: '',
    gender: 'unisexe',
    isFeatured: false,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.adminGetAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        stock: parseInt(formData.stock),
        images: formData.images ? formData.images.split(',').map(s => s.trim()) : [],
        colors: formData.colors ? formData.colors.split(',').map(s => s.trim()) : [],
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()) : [],
      };

      if (editingProduct) {
        await productService.adminUpdate(editingProduct.id, data);
      } else {
        await productService.adminCreate(data);
      }

      fetchProducts();
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Voulez-vous vraiment supprimer ce produit ?')) return;

    try {
      await productService.adminDelete(id);
      fetchProducts();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      comparePrice: product.comparePrice ? product.comparePrice.toString() : '',
      stock: product.stock.toString(),
      images: product.images.join(', '),
      colors: product.colors.join(', '),
      sizes: product.sizes.join(', '),
      gender: product.gender || 'unisexe',
      isFeatured: product.isFeatured || false,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      comparePrice: '',
      stock: '',
      images: '',
      colors: '',
      sizes: '',
      gender: 'unisexe',
      isFeatured: false,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Icons.Loading />
        <span className="ml-2 text-gray-500">Chargement des produits...</span>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-900 rounded-xl text-white">
            <Icons.Package />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
          <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
            {products.length} produit{products.length > 1 ? 's' : ''}
          </span>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            resetForm();
            setShowForm(!showForm);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            showForm 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
              : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/20'
          }`}
        >
          {showForm ? <Icons.X /> : <Icons.Plus />}
          {showForm ? 'Fermer' : 'Ajouter un produit'}
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 fade-in">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            {editingProduct ? <Icons.Edit /> : <Icons.Plus />}
            {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nom du produit"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                placeholder="nom-du-produit"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50 placeholder:text-gray-400"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Description du produit"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Icons.Euro />
                Prix *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Prix barré (€)</label>
              <input
                type="number"
                name="comparePrice"
                value={formData.comparePrice}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                placeholder="0"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Icons.Users />
                Genre
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50"
              >
                <option value="unisexe">Unisexe</option>
                <option value="femme">Femme</option>
                <option value="homme">Homme</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Icons.Image />
                Images (URLs séparées par des virgules)
              </label>
              <input
                type="text"
                name="images"
                value={formData.images}
                onChange={handleChange}
                placeholder="https://exemple.com/image1.jpg, https://exemple.com/image2.jpg"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Icons.Palette />
                Couleurs
              </label>
              <input
                type="text"
                name="colors"
                value={formData.colors}
                onChange={handleChange}
                placeholder="Noir, Blanc, Rouge"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Icons.Ruler />
                Tailles
              </label>
              <input
                type="text"
                name="sizes"
                value={formData.sizes}
                onChange={handleChange}
                placeholder="S, M, L, XL"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50 placeholder:text-gray-400"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <Icons.Star />
                  Produit en vedette
                </span>
              </label>
            </div>
            <div className="md:col-span-2 flex gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium text-sm hover:shadow-lg hover:shadow-gray-900/20"
              >
                <Icons.Check />
                {editingProduct ? 'Modifier' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium text-sm"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des produits */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vedette</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <Icons.Euro />
                      {product.price}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      product.stock > 10 ? 'bg-emerald-50 text-emerald-700' :
                      product.stock > 0 ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 capitalize">{product.gender}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {product.isFeatured ? <Icons.Star /> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleEdit(product)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Icons.Edit />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1"
                    >
                      <Icons.Trash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;