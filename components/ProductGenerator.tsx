import React, { useState } from 'react';
import { generateFakeProduct, FakeProduct } from '../services/gemini';
import ProductCard from './ProductCard';
import MisprintText from './MisprintText';

const ProductGenerator: React.FC = () => {
  const [generatedProduct, setGeneratedProduct] = useState<FakeProduct | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const product = await generateFakeProduct();
    setGeneratedProduct(product);
    setLoading(false);
  };

  return (
    <div className="col-span-1 md:col-span-3 mt-16 border-t-2 border-dashed border-ink pt-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <MisprintText text="REALITY OUT OF STOCK?" className="text-4xl md:text-5xl font-bold mb-4" />
        <p className="font-mono text-lg mb-8">
          Use our experimental <strong>Gemini™ Hallucination Engine</strong> to fabricate a product that doesn't exist, but probably should.
        </p>
        
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className={`
            relative px-8 py-4 text-xl font-bold uppercase tracking-widest border-2 border-ink 
            transition-all duration-200 bg-mustard text-ink
            ${loading ? 'opacity-50 cursor-wait' : 'hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_#1a1a1a] active:translate-x-0 active:translate-y-0 active:shadow-none'}
          `}
        >
          {loading ? 'FABRICATING...' : 'GENERATE NEW LIES'}
        </button>
      </div>

      {generatedProduct && (
        <div className="max-w-sm mx-auto animate-fade-in-up">
           <ProductCard 
             number="???"
             name={generatedProduct.name}
             description={generatedProduct.description}
             price={generatedProduct.price}
             warning={generatedProduct.warning}
             colorBg="bg-white"
             icon={
                <div className="text-6xl filter drop-shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
                    {generatedProduct.icon}
                </div>
             }
           />
        </div>
      )}
    </div>
  );
};

export default ProductGenerator;
