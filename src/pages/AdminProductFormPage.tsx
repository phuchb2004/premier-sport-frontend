import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import type { CreateProductRequest, Product, ProductCategory } from '../types';

const CATEGORIES: ProductCategory[] = ['KITS', 'BOOTS', 'ACCESSORIES', 'BALLS'];
const SIZE_PRESETS = {
  clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  boots: ['6', '7', '8', '9', '10', '11', '12'],
  balls: ['3', '4', '5'],
};

interface FormState {
  name: string;
  category: ProductCategory;
  brand: string;
  description: string;
  price: string;
  salePrice: string;
  clearSalePrice: boolean;
  images: string[];
  sizes: string[];
  stock: string;
  isFeatured: boolean;
}

const defaultForm: FormState = {
  name: '',
  category: 'KITS',
  brand: '',
  description: '',
  price: '',
  salePrice: '',
  clearSalePrice: false,
  images: [],
  sizes: [],
  stock: '',
  isFeatured: false,
};

function productToForm(p: Product): FormState {
  return {
    name: p.name,
    category: p.category,
    brand: p.brand,
    description: p.description,
    price: String(p.price),
    salePrice: p.salePrice != null ? String(p.salePrice) : '',
    clearSalePrice: false,
    images: [...p.images],
    sizes: [...p.sizes],
    stock: String(p.stock),
    isFeatured: p.isFeatured,
  };
}

export default function AdminProductFormPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(defaultForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageUrl, setImageUrl] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    adminService
      .getProductById(id)
      .then((p) => setForm(productToForm(p)))
      .catch(() => navigate('/admin/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const set = (field: keyof FormState, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
    setUploadError('');
  };

  const handleS3Upload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    setUploadError('');
    try {
      const { presignedUrl, publicUrl } = await adminService.getPresignedUrl(uploadFile.name);
      await adminService.uploadImageToS3(presignedUrl, uploadFile);
      setForm((prev) => ({ ...prev, images: [...prev.images, publicUrl] }));
      setUploadFile(null);
      setUploadPreview(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch {
      setUploadError('Upload failed. Check S3 configuration.');
    } finally {
      setUploading(false);
    }
  };

  const addImageUrl = () => {
    const url = imageUrl.trim();
    if (!url) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
    setImageUrl('');
  };

  const removeImage = (idx: number) =>
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.brand.trim()) errs.brand = 'Brand is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) errs.price = 'Valid price required';
    if (form.salePrice) {
      const sp = parseFloat(form.salePrice);
      if (isNaN(sp) || sp <= 0) errs.salePrice = 'Valid sale price required';
      else if (sp >= price) errs.salePrice = 'Sale price must be less than regular price';
    }
    const stock = parseInt(form.stock);
    if (isNaN(stock) || stock < 0) errs.stock = 'Valid stock required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: CreateProductRequest = {
        name: form.name.trim(),
        category: form.category,
        brand: form.brand.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        salePrice: form.salePrice ? parseFloat(form.salePrice) : undefined,
        images: form.images,
        sizes: form.sizes,
        stock: parseInt(form.stock),
        isFeatured: form.isFeatured,
      };

      if (isEdit && id) {
        const updatePayload = {
          ...payload,
          clearSalePrice: form.clearSalePrice || (!form.salePrice),
        };
        await adminService.updateProduct(id, updatePayload);
      } else {
        await adminService.createProduct(payload);
      }
      navigate('/admin/products');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErrors({ submit: msg || 'Failed to save product' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/products" className="text-sm text-gray-500 hover:text-gray-700">← Products</Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-medium text-gray-900">{isEdit ? 'Edit product' : 'New product'}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {errors.submit}
          </div>
        )}

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        {/* Category + Brand */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value as ProductCategory)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
            <input
              value={form.brand}
              onChange={(e) => set('brand', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.brand ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.brand && <p className="text-xs text-red-600 mt-1">{errors.brand}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={4}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
        </div>

        {/* Price + Sale Price + Stock */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (£) *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.price ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (£)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.salePrice}
              onChange={(e) => set('salePrice', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.salePrice ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.salePrice && <p className="text-xs text-red-600 mt-1">{errors.salePrice}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => set('stock', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.stock ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.stock && <p className="text-xs text-red-600 mt-1">{errors.stock}</p>}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
          <div className="space-y-2">
            {Object.entries(SIZE_PRESETS).map(([preset, sizes]) => (
              <div key={preset} className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-500 w-16 pt-1 capitalize">{preset}:</span>
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSize(s)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium border transition-colors ${
                      form.sizes.includes(s)
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ))}
            {form.sizes.length > 0 && (
              <p className="text-xs text-gray-500">Selected: {form.sizes.join(', ')}</p>
            )}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>

          {/* S3 upload */}
          <div className="border border-dashed border-gray-300 rounded-lg p-4 mb-3">
            <div className="flex items-center gap-3">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm text-gray-600 file:mr-3 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 file:rounded-lg file:border-0 file:px-3 file:py-1.5 hover:file:bg-gray-200"
              />
              {uploadFile && (
                <button
                  type="button"
                  disabled={uploading}
                  onClick={handleS3Upload}
                  className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Uploading…' : 'Upload to S3'}
                </button>
              )}
            </div>
            {uploadPreview && (
              <img src={uploadPreview} alt="Preview" className="mt-3 w-24 h-24 object-cover rounded-lg border border-gray-200" />
            )}
            {uploadError && <p className="text-xs text-red-600 mt-2">{uploadError}</p>}
          </div>

          {/* Add URL manually */}
          <div className="flex gap-2 mb-3">
            <input
              type="url"
              placeholder="Or paste image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={addImageUrl}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              Add
            </button>
          </div>

          {/* Current images */}
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.images.map((url, i) => (
                <div key={i} className="relative group">
                  <img
                    src={url}
                    alt={`Image ${i + 1}`}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => set('isFeatured', !form.isFeatured)}
            className={`w-10 h-5 rounded-full transition-colors relative ${form.isFeatured ? 'bg-green-500' : 'bg-gray-200'}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                form.isFeatured ? 'translate-x-5' : ''
              }`}
            />
          </button>
          <label className="text-sm text-gray-700">Featured on homepage</label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
          </button>
        </div>
      </form>
    </div>
  );
}
