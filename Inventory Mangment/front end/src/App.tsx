import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto'; // Import the Chart.js library
import './App.css'; // Import the external CSS file

interface Product {
  _id: string;
  name: string;
  inventory: number;
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProductName, setNewProductName] = useState<string>('');
  const [newInventoryLevel, setNewInventoryLevel] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Store the selected product for modification

  const chartRef = useRef<Chart | null>(null); // Ref to hold the Chart instance

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    renderChart();
  }, [products]); // Re-render the chart when products change

  const fetchProducts = async (): Promise<void> => {
    try {
      const response = await axios.get<Product[]>('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Handle error
    }
  };

  const handleAddProduct = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    if (!newProductName || isNaN(newInventoryLevel)) {
      alert('Please fill in all fields correctly.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/products/api/addprod', {
        name: newProductName,
        inventory: newInventoryLevel,
      });
      setNewProductName('');
      setNewInventoryLevel(0);
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
    }
  };

  const handleModifyProduct = (product: Product): void => {
    setSelectedProduct(product);
    handleUpdateProduct();
  };

  const handleUpdateProduct = async (): Promise<void> => {
    if (!selectedProduct) return;

    try {
      await axios.put(`http://localhost:5000/api/products/api/modprod/${selectedProduct._id}`, {
        name: selectedProduct.name,
        inventory: selectedProduct.inventory,
      });
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
    }
  };

  const renderChart = () => {
    const ctx = document.getElementById('inventoryChart') as HTMLCanvasElement;
    if (!ctx || !products.length) return;

    // Destroy the previous chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const productNames = products.map((product) => product.name);
    const inventoryLevels = products.map((product) => product.inventory);

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: productNames,
        datasets: [
          {
            label: 'Inventory Level',
            data: inventoryLevels,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  return (
    <div className="App">
      <header>
        <h1>Inventory Management System Demo</h1>
      </header>
      <main>
        <section id="productList">
          <h2>Product Inventory</h2>
          <ol id="productItems">
            {products.map((product) => (
              <li key={product._id}>
                
                {product.name} - Inventory: {product.inventory}
              
                <button  className='buto' onClick={() => handleModifyProduct(product)}>Modify</button>
                <input className='buto' placeholder='inventory' type="number"
              id="inventoryLevel"
              value={product.inventory}
              onChange={(e) => setNewInventoryLevel(parseInt(e.target.value))}
              required
               ></input></li>
            ))}
          </ol>
        </section>
        <section id="addProduct">
          <h2>Add New Product</h2>
          <form onSubmit={handleAddProduct}>
            <label htmlFor="productName">Product Name:</label>
            <input
              type="text"
              id="productName"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
            />
            <label htmlFor="inventoryLevel">Inventory Level:</label>
            <input
              type="number"
              id="inventoryLevel"
              value={newInventoryLevel}
              onChange={(e) => setNewInventoryLevel(parseInt(e.target.value))}
              required
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
            />
            <button className='button1' type="submit" style={{ padding: '0.5rem 1rem' }}>Add Product</button>
          </form>
        </section>
        <section id="chartSection">
          <h2>Product Inventory Chart</h2>
          <canvas id="inventoryChart" width="400" height="200"></canvas>
        </section>
      </main>
    </div>
  );
};

export default App;


