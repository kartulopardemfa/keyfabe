import React from 'react';
import ProductCard from './ProductCard';

interface Design {
    name: string;
    line: string;
    art: string;
    price?: string;
    warning?: string;
}

interface ProductGridProps {
    designs: Design[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ designs }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {designs.map((design, index) => (
                <ProductCard
                    key={design.name}
                    number={String(index + 1).padStart(3, '0')}
                    name={design.name}
                    description={design.line}
                    art={design.art}
                    price={design.price || "$45.00"}
                    warning={index === 1 ? "DO NOT READ" : undefined}
                />
            ))}
        </div>
    );
};

export default ProductGrid;
