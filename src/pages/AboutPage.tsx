import { Layout } from '../components/layout/Layout';

export default function AboutPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Premier Sport</h1>
          <p className="text-xl text-gray-500">
            Your home for premium football gear
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Premier Sport was founded with a simple mission: make top-quality football gear
              accessible to players at every level. Whether you're a Sunday league warrior or
              an aspiring professional, you deserve the best.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We stock kits, boots, accessories, and training equipment from the world's
              leading brands, curated by our team of passionate football enthusiasts.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-12 text-center text-white">
            <div className="text-7xl mb-4">⚽</div>
            <p className="text-green-100 font-medium">Est. 2024</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            { value: '500+', label: 'Products' },
            { value: '50+', label: 'Brands' },
            { value: '10k+', label: 'Happy customers' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-8 bg-white border border-gray-200 rounded-2xl">
              <div className="text-3xl font-bold text-green-600 mb-1">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
