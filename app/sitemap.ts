import routes from '@/lib/eon/required-routes.json';
export default function sitemap(){return [...routes,{path:'/terms-and-conditions/'}].filter(r=>!r.path.startsWith('/elementor-hf/')).map(r=>({url:`https://eoncoatings.com${r.path}`}));}
