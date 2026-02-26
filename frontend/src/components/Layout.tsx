"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarInset,
	SidebarHeader,
	SidebarFooter,
} from "@/components/ui/sidebar";
import { mainNavItems, bottomNavItems } from "@/constants/navItems.constant";
import { Bell, Calendar, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthUser } from "@/types/auth";

interface AppSidebarProps {
	activeTab: string;
	onTabChange: (tab: string) => void;
	user?: AuthUser | null;
}

export function AppSidebar({ activeTab, onTabChange, user }: AppSidebarProps) {
	const isAdmin = user?.role === "admin";
	
	// Filter nav items based on role
	const filteredMainNavItems = mainNavItems.filter(item => {
		// Users tab only for admin
		if (item.path === "users") return isAdmin;
		return true;
	});
	
	return (
		<Sidebar className="bg-gray-950 border-gray-800">
			<SidebarHeader className="p-6">
				<h2 className="text-2xl font-bold text-white">Metric Flow</h2>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{filteredMainNavItems.map((item) => (
								<SidebarMenuItem key={item.path}>
									<SidebarMenuButton
										onClick={() => onTabChange(item.path)}
										isActive={activeTab === item.path}
										className={`text-gray-300 hover:text-white hover:bg-gray-800 transition-colors ${
											activeTab === item.path ?
												"bg-orange-500/20 text-orange-400 border-r-2 border-orange-500"
											:	""
										}`}>
										<item.icon className="h-5 w-5" />
										<span className="font-medium">{item.title}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{bottomNavItems.map((item) => (
								<SidebarMenuItem key={item.path}>
									<SidebarMenuButton
										onClick={() => onTabChange(item.path)}
										isActive={activeTab === item.path}
										className={`text-gray-300 hover:text-white hover:bg-gray-800 transition-colors ${
											activeTab === item.path ?
												"bg-orange-500/20 text-orange-400 border-r-2 border-orange-500"
											:	""
										}`}>
										<item.icon className="h-5 w-5" />
										<span className="font-medium">{item.title}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarFooter>
		</Sidebar>
	);
}

interface TopHeaderProps {
	user?: AuthUser | null;
	onLogout?: () => void;
}

function TopHeader({ user, onLogout }: TopHeaderProps) {
	const currentDate = new Date().toLocaleDateString("en-US", {
		weekday: "short",
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	return (
		<div className="flex items-center justify-between p-6 bg-gray-900 border-b border-gray-800">
			<div className="flex items-center space-x-4 flex-1">
				<h2 className="text-xl font-semibold text-white">Dashboard</h2>
			</div>
			<div className="flex items-center space-x-4">
				<div className="flex items-center text-gray-300">
					<Calendar className="h-4 w-4 mr-2" />
					<span className="text-sm">{currentDate}</span>
				</div>
				<Button
					variant="ghost"
					size="icon"
					className="text-gray-300 hover:text-white">
					<Bell className="h-5 w-5" />
				</Button>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="flex items-center space-x-2 text-gray-300 hover:text-white">
							<div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
								<span className="text-white text-sm font-semibold">
									{user?.firstName?.[0] || "U"}
								</span>
							</div>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<DropdownMenuItem onClick={onLogout}>
							<LogOut className="h-4 w-4 mr-2" />
							Logout
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}

interface LayoutProps {
	children: React.ReactNode;
	activeTab: string;
	onTabChange: (tab: string) => void;
	searchQuery?: string;
	onSearchChange?: (query: string) => void;
	user?: AuthUser | null;
	onLogout?: () => void;
}

export function Layout({
	children,
	activeTab,
	onTabChange,
	user,
	onLogout,
}: LayoutProps) {
	return (
		<div className="min-h-screen bg-gray-950">
			<SidebarProvider>
				<AppSidebar
					activeTab={activeTab}
					onTabChange={onTabChange}
					user={user}
				/>
				<SidebarInset className="bg-gray-950">
					<TopHeader user={user} onLogout={onLogout} />
					<div className="flex-1 p-6">{children}</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
