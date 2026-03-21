import { useLanguage } from '../context/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();

  const STATS = [
    { value: '500+', label: t.statProducts },
    { value: '50+', label: t.statBrands },
    { value: '10k+', label: t.statCustomers },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.aboutTitle}</h1>
          <p className="text-xl text-gray-500">
            {t.aboutSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.ourStory}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {t.storyP1}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {t.storyP2}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-12 text-center text-white">
            <div className="text-7xl mb-4">⚽</div>
            <p className="text-green-100 font-medium">Est. 2024</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center p-8 bg-white border border-gray-200 rounded-2xl">
              <div className="text-3xl font-bold text-green-600 mb-1">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
  );
}
