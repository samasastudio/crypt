import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend, AreaChart, Area } from 'recharts';

const groceryData = {
  summary: { total_orders: 39, total_grocery_spend: 7168.01, avg_order_value: 183.8, unique_items: 284 },
  spending_by_category: {
    protein: 1699.17, fruits: 1256.31, condiments_seasonings: 701.80, nuts_seeds: 471.67,
    vegetables: 462.70, household: 411.36, dairy: 409.50, leafy_greens: 370.61,
    other: 348.31, beverages: 276.07, personal_care: 205.58, grains_starches: 131.51, health: 94.23, legumes: 25.38
  },
  monthly_spending: [
    { month: 'Jan', total: 243.17, orders: 1 }, { month: 'Feb', total: 811.25, orders: 4 },
    { month: 'Mar', total: 364.11, orders: 2 }, { month: 'Apr', total: 614.38, orders: 3 },
    { month: 'May', total: 625.40, orders: 3 }, { month: 'Jun', total: 552.46, orders: 3 },
    { month: 'Jul', total: 466.81, orders: 4 }, { month: 'Aug', total: 484.71, orders: 3 },
    { month: 'Sep', total: 573.01, orders: 4 }, { month: 'Oct', total: 909.80, orders: 4 },
    { month: 'Nov', total: 754.91, orders: 4 }, { month: 'Dec', total: 727.27, orders: 3 }
  ],
  top_proteins: [
    { name: 'Salmon', spend: 497.80, orders: 26 }, { name: 'Plant Nuggets', spend: 363.65, orders: 29 },
    { name: 'Jennie-O Turkey', spend: 176.09, orders: 12 }, { name: 'Chicken Thighs', spend: 110.84, orders: 14 },
    { name: 'Grass-Fed Beef', spend: 74.81, orders: 6 }, { name: 'Chicken Breast', spend: 64.79, orders: 4 }
  ],
  frequently_purchased: [
    { name: 'Avocado', qty: 131, orders: 39, spend: 237.32 }, { name: 'Limes', qty: 106, orders: 28, spend: 22.42 },
    { name: 'Romaine', qty: 64, orders: 30, spend: 211.46 }, { name: 'Lemons', qty: 77, orders: 19, spend: 57.48 },
    { name: 'Asparagus', qty: 26, orders: 26, spend: 77.23 }, { name: 'Cucumber', qty: 26, orders: 25, spend: 25.63 },
    { name: 'Mushrooms', qty: 69, orders: 32, spend: 155.58 }, { name: 'Bell Pepper', qty: 25, orders: 10, spend: 36.46 }
  ],
  nutrition_balance: [
    { category: 'Protein', value: 92 }, { category: 'Healthy Fats', value: 88 },
    { category: 'Hydration', value: 85 }, { category: 'Vegetables', value: 58 },
    { category: 'Fiber', value: 38 }, { category: 'Whole Grains', value: 18 },
    { category: 'Calcium', value: 45 }, { category: 'Cruciferous', value: 22 }
  ],
  seasonal_trends: [
    { quarter: 'Q1', protein: 412, produce: 298 }, { quarter: 'Q2', protein: 389, produce: 312 },
    { quarter: 'Q3', protein: 445, produce: 287 }, { quarter: 'Q4', protein: 453, produce: 359 }
  ]
};

const COLORS = {
  protein: '#E63946', fruits: '#F4A261', vegetables: '#2A9D8F', dairy: '#E9C46A',
  grains_starches: '#8B5CF6', legumes: '#6366F1', nuts_seeds: '#D4A373',
  condiments_seasonings: '#9CA3AF', leafy_greens: '#10B981', beverages: '#06B6D4',
  household: '#64748B', personal_care: '#EC4899', health: '#F472B6', other: '#78716C'
};

const CHART_COLORS = ['#E63946', '#F4A261', '#2A9D8F', '#264653', '#E9C46A', '#8B5CF6'];
const formatCurrency = (value) => `$${value.toFixed(0)}`;
const formatCategory = (cat) => cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export default function GroceryDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const categoryData = Object.entries(groceryData.spending_by_category)
    .map(([name, value]) => ({ name: formatCategory(name), value, color: COLORS[name] }))
    .sort((a, b) => b.value - a.value);
  const foodCategories = categoryData.filter(c => !['Household', 'Personal Care', 'Health'].includes(c.name));
  const totalSpend = groceryData.summary.total_grocery_spend;
  const tabs = [
    { id: 'overview', label: 'Overview' }, { id: 'nutrition', label: 'Nutrition' },
    { id: 'proteins', label: 'Proteins' }, { id: 'produce', label: 'Produce' }, { id: 'trends', label: 'Trends' }
  ];

  const cardStyle = {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
    borderRadius: '20px', padding: '28px', border: '1px solid rgba(255,255,255,0.06)'
  };
  const titleStyle = { margin: '0 0 20px', fontWeight: 400, color: '#64748B', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.7rem' };
  const tooltipStyle = { background: '#1E293B', border: '1px solid #334155', borderRadius: '12px' };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #0C1222 0%, #1A2332 40%, #0F172A 100%)',
      fontFamily: "system-ui, sans-serif", color: '#F1F5F9', padding: '32px', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(230, 57, 70, 0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.7rem', color: '#64748B', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px' }}>Full Year Analysis</div>
        <h1 style={{ fontSize: '3rem', fontWeight: 200, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0, background: 'linear-gradient(135deg, #F8FAFC 0%, #94A3B8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Grocery Analytics</h1>
        <p style={{ color: '#475569', marginTop: '12px', fontSize: '0.95rem' }}>
          Jan 16 â€“ Dec 22, 2025 â€¢ <span style={{ color: '#94A3B8' }}>39 Orders</span> â€¢ <span style={{ color: '#E63946' }}>${totalSpend.toLocaleString()}</span> Total
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '40px' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: '14px 28px', border: activeTab === tab.id ? 'none' : '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
            background: activeTab === tab.id ? 'linear-gradient(135deg, #E63946 0%, #DC2626 100%)' : 'rgba(255,255,255,0.02)',
            color: activeTab === tab.id ? '#FFF' : '#64748B', boxShadow: activeTab === tab.id ? '0 8px 32px rgba(230, 57, 70, 0.3)' : 'none'
          }}>{tab.label}</button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
          <div style={{ ...cardStyle, gridColumn: 'span 2' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px' }}>
              {[
                { label: 'Total Spent', value: `$${(totalSpend/1000).toFixed(1)}k`, color: '#E63946' },
                { label: 'Avg Order', value: '$184', color: '#F4A261' },
                { label: 'Orders', value: '39', color: '#2A9D8F' },
                { label: 'Items', value: '284', color: '#8B5CF6' },
                { label: 'Weekly Avg', value: '$142', color: '#06B6D4' }
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.25rem', fontWeight: 300, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={titleStyle}>Spending by Category</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart><Pie data={categoryData.slice(0, 8)} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={2} dataKey="value">
                {categoryData.slice(0, 8).map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie><Tooltip formatter={(v) => formatCurrency(v)} contentStyle={tooltipStyle} /></PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '12px' }}>
              {categoryData.slice(0, 6).map((cat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color }} /><span style={{ color: '#94A3B8' }}>{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={titleStyle}>Monthly Spending Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={groceryData.monthly_spending}>
                <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E63946" stopOpacity={0.5} /><stop offset="100%" stopColor="#E63946" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#475569" fontSize={11} /><YAxis stroke="#475569" fontSize={11} tickFormatter={formatCurrency} />
                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="total" stroke="#E63946" strokeWidth={2.5} fill="url(#sg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ ...cardStyle, gridColumn: 'span 2' }}>
            <h3 style={titleStyle}>Food Category Spending</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={foodCategories.slice(0, 10)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" stroke="#475569" fontSize={11} tickFormatter={formatCurrency} />
                <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={11} width={130} />
                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>{foodCategories.slice(0, 10).map((e, i) => <Cell key={i} fill={e.color} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Nutrition */}
      {activeTab === 'nutrition' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
          <div style={cardStyle}>
            <h3 style={titleStyle}>Nutritional Balance Score</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={groceryData.nutrition_balance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#475569" fontSize={11} />
                <YAxis type="category" dataKey="category" stroke="#64748B" fontSize={11} width={100} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}/100`, 'Score']} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>{groceryData.nutrition_balance.map((e, i) => <Cell key={i} fill={e.value >= 70 ? '#10B981' : e.value >= 40 ? '#F59E0B' : '#EF4444'} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px', fontSize: '0.7rem' }}>
              {[{ c: '#10B981', l: 'Strong (70+)' }, { c: '#F59E0B', l: 'Moderate' }, { c: '#EF4444', l: 'Gap (<40)' }].map((x, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: x.c }} /><span style={{ color: '#64748B' }}>{x.l}</span></div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={titleStyle}>Macro Distribution</h3>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart><Pie data={[{ name: 'Protein', value: 1699 }, { name: 'Produce', value: 833 }, { name: 'Fats', value: 472 }, { name: 'Dairy', value: 410 }, { name: 'Carbs', value: 157 }]} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value">
                {['#E63946', '#2A9D8F', '#F4A261', '#E9C46A', '#8B5CF6'].map((c, i) => <Cell key={i} fill={c} />)}
              </Pie><Tooltip formatter={(v) => formatCurrency(v)} contentStyle={tooltipStyle} /></PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ ...cardStyle, gridColumn: 'span 2' }}>
            <h3 style={titleStyle}>Year-End Nutritional Assessment</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {[
                { title: 'âœ“ Strengths', color: '#10B981', items: ['26 salmon orders (~$498)', '131 avocados', 'Diverse lean proteins', 'Consistent hydration', 'Low processed foods'] },
                { title: 'âš  Opportunities', color: '#F59E0B', items: ['Leafy greens variety', 'Add kale, chard, arugula', 'More calcium sources', 'Yogurt only 7 orders', 'Consider legume variety'] },
                { title: 'âœ— Gaps to Address', color: '#EF4444', items: ['Whole grains absent', 'Only $132 on grains', 'Cruciferous veg minimal', 'Broccoli only 5 orders', 'No oats, quinoa, farro'] }
              ].map((section, i) => (
                <div key={i} style={{ padding: '24px', background: `${section.color}12`, borderRadius: '16px', border: `1px solid ${section.color}25` }}>
                  <div style={{ fontSize: '0.65rem', color: section.color, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px', fontWeight: 600 }}>{section.title}</div>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.85rem', color: '#94A3B8', lineHeight: 2 }}>{section.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Proteins */}
      {activeTab === 'proteins' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
          <div style={cardStyle}>
            <h3 style={titleStyle}>Protein Spend by Source</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groceryData.top_proteins} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" stroke="#475569" fontSize={11} tickFormatter={formatCurrency} />
                <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={11} width={110} />
                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={tooltipStyle} />
                <Bar dataKey="spend" radius={[0, 6, 6, 0]}>{groceryData.top_proteins.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={cardStyle}>
            <h3 style={titleStyle}>Order Frequency by Protein</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groceryData.top_proteins}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#475569" fontSize={9} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#475569" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} times`, 'Ordered']} />
                <Bar dataKey="orders" fill="#E63946" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ ...cardStyle, gridColumn: 'span 2' }}>
            <h3 style={titleStyle}>Protein Portfolio Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {[
                { label: 'Total Protein', value: '$1,699', icon: 'ðŸ¥©', color: '#E63946' },
                { label: 'Fish/Seafood', value: '$577', icon: 'ðŸŸ', color: '#06B6D4' },
                { label: 'Poultry', value: '$244', icon: 'ðŸ—', color: '#F4A261' },
                { label: 'Plant-Based', value: '$364', icon: 'ðŸŒ±', color: '#10B981' }
              ].map((item, i) => (
                <div key={i} style={{ padding: '24px', background: `${item.color}15`, borderRadius: '16px', border: `1px solid ${item.color}25`, textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{item.icon}</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 300, color: item.color }}>{item.value}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '6px', textTransform: 'uppercase' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Produce */}
      {activeTab === 'produce' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
          <div style={cardStyle}>
            <h3 style={titleStyle}>Produce by Quantity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groceryData.frequently_purchased}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} units`, 'Purchased']} />
                <Bar dataKey="qty" fill="#2A9D8F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={cardStyle}>
            <h3 style={titleStyle}>Order Consistency (of 39)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groceryData.frequently_purchased} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" stroke="#475569" fontSize={11} domain={[0, 39]} />
                <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={11} width={80} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} orders (${Math.round(v/39*100)}%)`, 'Frequency']} />
                <Bar dataKey="orders" fill="#F4A261" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ ...cardStyle, gridColumn: 'span 2' }}>
            <h3 style={titleStyle}>Produce Staples</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {groceryData.frequently_purchased.map((item, i) => (
                <div key={i} style={{ padding: '20px', background: 'rgba(42, 157, 143, 0.1)', borderRadius: '14px', border: '1px solid rgba(42, 157, 143, 0.12)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 300, color: '#2A9D8F' }}>{item.qty}</div>
                  <div style={{ fontSize: '0.9rem', color: '#F1F5F9', marginTop: '4px', fontWeight: 500 }}>{item.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '6px' }}>{Math.round(item.orders/39*100)}% â€¢ {formatCurrency(item.spend)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trends */}
      {activeTab === 'trends' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
          <div style={cardStyle}>
            <h3 style={titleStyle}>Quarterly Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groceryData.seasonal_trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="quarter" stroke="#475569" fontSize={12} />
                <YAxis stroke="#475569" fontSize={11} tickFormatter={formatCurrency} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatCurrency(v)} />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                <Bar dataKey="protein" name="Protein" fill="#E63946" radius={[4, 4, 0, 0]} />
                <Bar dataKey="produce" name="Produce" fill="#2A9D8F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={cardStyle}>
            <h3 style={titleStyle}>Monthly Order Count</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={groceryData.monthly_spending}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={11} domain={[0, 5]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="orders" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ ...cardStyle, gridColumn: 'span 2' }}>
            <h3 style={titleStyle}>2025 Year in Review</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
              {[
                { label: 'Peak Month', value: 'October', sub: '$910', color: '#E63946' },
                { label: 'Lowest', value: 'January', sub: '$243', color: '#06B6D4' },
                { label: 'Most Orders', value: 'Oct/Nov', sub: '4 each', color: '#8B5CF6' },
                { label: 'Weekly Avg', value: '$142', sub: 'groceries', color: '#F4A261' },
                { label: 'Top Item', value: 'Avocado', sub: '131 units', color: '#2A9D8F' },
                { label: 'Busiest Day', value: 'Sunday', sub: 'ordering', color: '#EC4899' }
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 300, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</div>
                  <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '2px' }}>{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
