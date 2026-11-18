import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { shopDataContext } from '../context/ShopContext'
import Card from './Card'

function EditorialCard({ title, image, to, tall = false, subtitle }) {
 return <Link to={to} className={'group relative block overflow-hidden rounded-xl bg-slate-800 focus-visible:outline-4 focus-visible:outline-emerald-500 ' + (tall ? 'aspect-[3/4]' : 'aspect-[4/3] md:aspect-[3/2]')}>
 {image && <img src={image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-105"/>}
 <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent"/>
 <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 flex items-end justify-between gap-3"><div>{subtitle && <p className="text-white/80 text-xs uppercase tracking-[0.2em] mb-2">{subtitle}</p>}<h3 className="text-white text-xl md:text-3xl font-semibold">{title}</h3></div><span className="shrink-0 rounded-full bg-white text-black px-4 py-3 text-sm">Shop now <span aria-hidden="true">?</span></span></div>
 </Link>
}

export default function StoreSections() {
 const { settings, products } = useContext(shopDataContext)
 const categories = settings.customCategories || []
 const departments = ['Women', 'Men'].map(title => ({ title, product:products.find(p=>p.category===title) })).filter(x=>x.product)
 const discovery = [...new Set(products.map(p=>p.subCategory).filter(Boolean))].slice(0,4)
 return <div className="max-w-[1440px] mx-auto px-5 md:px-8">
 {!!departments.length && <section aria-label="Shop women and men" className="grid md:grid-cols-2 gap-5 md:gap-7 py-10 md:py-16">{departments.map(d=><EditorialCard key={d.title} title={d.title} subtitle="Find your everyday favourites" image={categories.find(c=>c.title.toLowerCase()===d.title.toLowerCase())?.image || d.product.image1} to={'/collection?category='+encodeURIComponent(d.title)}/>)}</section>}
 {!!(categories.length || discovery.length) && <section className="pb-12 md:pb-20"><p className="text-center text-xs tracking-[0.25em] uppercase text-gray-500 mb-3">Explore your next favourite</p><h2 className="text-center text-3xl md:text-4xl font-semibold tracking-tight mb-8">Discover a New Approach</h2><div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">{categories.length ? categories.map(c=><EditorialCard key={c.id} title={c.title} image={c.image || products.find(p=>c.productIds.includes(p._id))?.image1} tall to={'/collection?customCategory='+encodeURIComponent(c.id)}/>) : discovery.map(title=><EditorialCard key={title} title={title} image={products.find(p=>p.subCategory===title)?.image1} tall to={'/collection?category='+encodeURIComponent(title)}/>)}</div></section>}
 {settings.homeSections?.map(s=>{
 const selected=s.productIds.map(id=>products.find(p=>p._id===id)).filter(Boolean)
 const to='/collection?section='+encodeURIComponent(s.id)
 return <section key={s.id} className="pb-12 md:pb-20">
 {s.layout==='spotlight' ? <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden bg-[#eeeae3]"><div className="p-8 md:p-16 flex flex-col justify-center items-start"><p className="text-xs uppercase tracking-[0.25em] mb-5">The ShopX edit</p><h2 className="text-4xl md:text-5xl font-semibold tracking-tight">{s.title}</h2>{s.subtitle&&<p className="text-gray-600 mt-5 leading-relaxed">{s.subtitle}</p>}<Link className="mt-8 rounded-full bg-black text-white px-7 py-4" to={to}>{s.cta||'Explore the collection'} <span aria-hidden="true">?</span></Link></div>{(s.image||selected[0]?.image1)&&<img src={s.image||selected[0].image1} alt="" loading="lazy" className="w-full h-full max-h-[600px] min-h-[320px] object-cover"/>}</div> : <><div className="flex justify-between gap-4 items-end mb-7"><div><h2 className="text-2xl md:text-3xl font-semibold">{s.title}</h2>{s.subtitle&&<p className="text-gray-500 mt-2">{s.subtitle}</p>}</div><Link to={to} className="text-sm underline underline-offset-4 shrink-0">View all</Link></div><div className={s.layout==='editorial'?'grid md:grid-cols-2 gap-6':s.layout==='carousel'?'flex overflow-x-auto snap-x snap-mandatory gap-5 pb-5':'grid grid-cols-2 md:grid-cols-4 gap-5'}>{selected.map(p=>s.layout==='editorial'?<EditorialCard key={p._id} title={p.name} image={p.image1} to={'/productdetail/'+p._id}/>:<div key={p._id} className={s.layout==='carousel'?'w-[180px] md:w-[270px] shrink-0 snap-start':''}><Card id={p._id} name={p.name} image={p.image1} price={p.price}/></div>)}</div></>}
 </section>})}
 </div>
}
