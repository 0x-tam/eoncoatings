import Link from '@/components/eon/PageLink';
import {ArrowUpRight, MoveHorizontal} from 'lucide-react';
import {services} from '@/lib/eon/services';
import './service-overview.css';

const tiles=[
 {index:0,label:'Home/Villa AC care',image:'ac-home',alt:'3D home interior with a wall-mounted AC'},
 {index:0,label:'Office AC care',image:'ac-office-v3',alt:'3D office with a flush ceiling air vent'},
 {index:1,label:'Surface protection',image:'surface',alt:'Clean countertop with a folded teal cloth'},
 {index:2,label:'Fabric protection',image:'fabric',alt:'Teal armchair with an ivory cushion'},
 {index:3,label:'Marble protection',image:'marble',alt:'Cream marble with natural veining'},
 {index:4,label:'Furniture & carpet cleaning',image:'cleaning',alt:'Upholstery extraction nozzle on a sofa'},
 {index:5,label:'Mattress cleaning',image:'mattress',alt:'Quilted mattress with a sage throw'},
 {index:6,label:'Specialty coatings',image:'specialty',alt:'Roller applying protective coating to a wall sample'},
];
export default function ServiceOverview(){return <section id="services" className="service-overview" aria-labelledby="service-overview-title"><div className="service-overview-heading"><h2 id="service-overview-title">Explore our services</h2><Link href="/service/">All services <ArrowUpRight size={16} aria-hidden="true"/></Link></div><nav className="service-overview-list" aria-label="Cleaning and protection services">{tiles.map(tile=><Link className="service-overview-link" href={tile.image==='ac-office-v3'?'/services/office-ac-duct-care/':`/services/${services[tile.index].slug}/`} key={tile.image}><span className="service-overview-photo"><img src={`/images/service-icons-3d/${tile.image}.webp`} width={480} height={480} alt={tile.alt} decoding="async"/></span><span className="service-overview-label">{tile.label}<ArrowUpRight size={16} aria-hidden="true"/></span></Link>)}</nav><p className="service-overview-swipe"><MoveHorizontal size={16} aria-hidden="true"/> Swipe to explore all 8 services</p></section>}
