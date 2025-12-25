import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Colors Section - Left Side */}
        <section className="space-y-6">
          <div>
            <p className="text-body-2 text-brown-400 mb-1">Color</p>
            <h2 className="text-headline-2 text-brown-400">Colors</h2>
          </div>

          {/* Base Palette */}
          <div className="space-y-3">
            <h3 className="text-body-1 text-brown-500 font-semibold">Base</h3>
            <div className="flex flex-wrap gap-3">
              <div className="flex flex-col">
                <div className="w-24 h-16 bg-brown-600 rounded"></div>
                <p className="text-body-2 text-brown-500 mt-1">Brown 600</p>
                <p className="text-body-2 text-brown-400">#26231E</p>
              </div>
              <div className="flex flex-col">
                <div className="w-24 h-16 bg-brown-500 rounded"></div>
                <p className="text-body-2 text-brown-500 mt-1">Brown 500</p>
                <p className="text-body-2 text-brown-400">#43403B</p>
              </div>
              <div className="flex flex-col">
                <div className="w-24 h-16 bg-brown-400 rounded"></div>
                <p className="text-body-2 text-brown-500 mt-1">Brown 400</p>
                <p className="text-body-2 text-brown-400">#75716B</p>
              </div>
              <div className="flex flex-col">
                <div className="w-24 h-16 bg-brown-300 rounded"></div>
                <p className="text-body-2 text-brown-500 mt-1">Brown 300</p>
                <p className="text-body-2 text-brown-400">#DAD6D1</p>
              </div>
              <div className="flex flex-col">
                <div className="w-24 h-16 bg-brown-200 rounded"></div>
                <p className="text-body-2 text-brown-500 mt-1">Brown 200</p>
                <p className="text-body-2 text-brown-400">#EFEEEB</p>
              </div>
              <div className="flex flex-col">
                <div className="w-24 h-16 bg-brown-100 rounded"></div>
                <p className="text-body-2 text-brown-500 mt-1">Brown 100</p>
                <p className="text-body-2 text-brown-400">#F9F8F6</p>
              </div>
              <div className="flex flex-col">
                <div className="w-24 h-16 bg-white border border-brown-300 rounded"></div>
                <p className="text-body-2 text-brown-500 mt-1">White</p>
                <p className="text-body-2 text-brown-400">#FFFFFF</p>
              </div>
            </div>
          </div>

          {/* Brand Palette */}
          <div className="space-y-3">
            <h3 className="text-body-1 text-brown-500 font-semibold">Brand</h3>
            <div className="flex flex-wrap gap-3">
              <div className="flex flex-col">
                <div className="w-24 h-16 bg-brand-orange rounded"></div>
                <p className="text-body-2 text-brown-500 mt-1">Orange</p>
                <p className="text-body-2 text-brown-400">#F2B68C</p>
              </div>
              <div className="flex flex-col">
                <div className="w-24 h-16 bg-brand-green rounded"></div>
                <p className="text-body-2 text-brown-500 mt-1">Green</p>
                <p className="text-body-2 text-brown-400">#12B279</p>
              </div>
              <div className="flex flex-col">
                <div className="w-24 h-16 bg-brand-green-soft rounded"></div>
                <p className="text-body-2 text-brown-500 mt-1">Green</p>
                <p className="text-body-2 text-brown-400">#D7F2E9</p>
              </div>
              <div className="flex flex-col">
                <div className="w-24 h-16 bg-brand-red rounded"></div>
                <p className="text-body-2 text-brown-500 mt-1">Red</p>
                <p className="text-body-2 text-brown-400">#EB5164</p>
              </div>
            </div>
          </div>
        </section>

        {/* Fonts Section - Right Side */}
        <section className="space-y-6">
          <div>
            <p className="text-body-2 text-brown-400 mb-1">Font</p>
            <h2 className="text-headline-2 text-brown-400">Fonts</h2>
          </div>

          <div className="space-y-4">
            <h1 className="text-headline-1 text-weight-headline text-brown-600">
              Headline 1
            </h1>
            <h2 className="text-headline-2 text-weight-headline text-brown-600">
              Headline 2
            </h2>
            <h3 className="text-headline-3 text-weight-headline text-brown-600">
              Headline 3
            </h3>
            <h4 className="text-headline-4 text-weight-headline text-brown-600">
              Headline 4
            </h4>
            <p className="text-body-1 text-weight-body text-brown-600">
              Body 1
            </p>
            <p className="text-body-2 text-weight-body text-brown-600">
              Body 2
            </p>
            <p className="text-body-2 text-weight-body text-brown-600">
              Body 2
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
