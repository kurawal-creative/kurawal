import { useLocation } from "react-router-dom";

export interface BreadcrumbItem {
    label : string;
    path : string;
    
}

export function userBreadcrumbs(routes: Record<string, string>) : BreadcrumbItem[]{
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x)=>x);

    const breadcrumbs: BreadcrumbItem[] = pathnames.map((_,index)=>{
        const path = `/${pathnames.slice(0,index + 1).join("/")}`;
        const label = routes[path] || pathnames[index];

        return{label,path};
    })
    return breadcrumbs;
}