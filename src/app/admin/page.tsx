'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EnhancedButton } from '@/components/EnhancedButton'
import { ParticleBackground } from '@/components/ParticleBackground'
import { CounterAnimation } from '@/components/CounterAnimation'
import { PriceChart } from '@/components/charts/PriceChart'
import { MiningPerformanceChart, HashRateChart, PoolComparisonChart } from '@/components/charts/MiningChart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import {
  Users,
  Settings,
  BarChart3,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Zap,
  Database,
  Server,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  Mail,
  Bell
} from 'lucide-react'

export default function AdminPage() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [poolStatus, setPoolStatus] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  const adminStats = [
    {
      label: 'Total Users',
      value: 50247,
      change: '+12.5%',
      positive: true,
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-400'
    },
    {
      label: 'Active Miners',
      value: 18903,
      change: '+8.2%',
      positive: true,
      icon: <Zap className="w-6 h-6" />,
      color: 'text-green-400'
    },
    {
      label: 'Total Revenue',
      value: 2847291.56,
      suffix: ' USDT',
      change: '+15.3%',
      positive: true,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-primary'
    },
    {
      label: 'Pool Efficiency',
      value: 98.7,
      suffix: '%',
      change: '+0.5%',
      positive: true,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-cyan-400'
    }
  ]

  const recentUsers = [
    {
      address: '0x1234...5678',
      joinDate: '2024-01-15',
      hashRate: '125.4 TH/s',
      rewards: '2.847 ETH',
      status: 'Active'
    },
    {
      address: '0x9876...4321',
      joinDate: '2024-01-14',
      hashRate: '89.2 TH/s',
      rewards: '1.923 ETH',
      status: 'Active'
    },
    {
      address: '0x5555...9999',
      joinDate: '2024-01-13',
      hashRate: '0 TH/s',
      rewards: '0 ETH',
      status: 'Inactive'
    }
  ]

  const systemAlerts = [
    {
      type: 'warning',
      message: 'Pool #3 efficiency below 95%',
      time: '5 minutes ago',
      severity: 'Medium'
    },
    {
      type: 'error',
      message: 'Server maintenance required',
      time: '1 hour ago',
      severity: 'High'
    },
    {
      type: 'info',
      message: 'New user registration spike detected',
      time: '2 hours ago',
      severity: 'Low'
    }
  ]

  const miningPools = [
    {
      id: 'pool-001',
      name: 'Main ETH Pool',
      hashRate: '1.2 EH/s',
      miners: 15847,
      efficiency: 98.7,
      status: 'Active',
      reward: '144129961.86 ETH'
    },
    {
      id: 'pool-002',
      name: 'BTC Pool Alpha',
      hashRate: '800 PH/s',
      miners: 8902,
      efficiency: 97.2,
      status: 'Active',
      reward: '2847.56 BTC'
    },
    {
      id: 'pool-003',
      name: 'Secondary ETH',
      hashRate: '450 TH/s',
      miners: 3421,
      efficiency: 94.8,
      status: 'Warning',
      reward: '1923.78 ETH'
    }
  ]

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />

      {/* Admin Header */}
      <header className="p-4 frosted-glass border-b border-border/20 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gold-text">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Mining Pool Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="destructive" className="animate-pulse">
              ADMIN ACCESS
            </Badge>
            <EnhancedButton variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Alerts (3)
            </EnhancedButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 relative z-10">

        {/* Quick Controls */}
        <section className="mb-8">
          <Card className="frosted-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={poolStatus}
                    onCheckedChange={setPoolStatus}
                  />
                  <span className="font-medium">Mining Pool Status</span>
                  <Badge variant={poolStatus ? 'default' : 'destructive'}>
                    {poolStatus ? 'Active' : 'Stopped'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={maintenanceMode}
                    onCheckedChange={setMaintenanceMode}
                  />
                  <span className="font-medium">Maintenance Mode</span>
                  {maintenanceMode && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                </div>
              </div>
              <div className="flex gap-2">
                <EnhancedButton variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </EnhancedButton>
                <EnhancedButton size="sm" className="bg-red-600 hover:bg-red-700">
                  Emergency Stop
                </EnhancedButton>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Admin Stats */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {adminStats.map((stat, index) => (
              <Card key={stat.label} className="frosted-glass floating" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={stat.color}>{stat.icon}</div>
                    <Badge variant={stat.positive ? 'default' : 'destructive'} className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    <CounterAnimation
                      end={stat.value}
                      decimals={stat.suffix?.includes('USDT') ? 2 : 0}
                      suffix={stat.suffix || ''}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pools">Mining Pools</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* System Alerts */}
            <section>
              <h2 className="text-2xl font-bold mb-6 gold-text">System Alerts</h2>
              <div className="space-y-4">
                {systemAlerts.map((alert, index) => (
                  <Card key={`alert-${alert.message}-${index}`} className="frosted-glass">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {alert.type === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
                          {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                          {alert.type === 'info' && <CheckCircle className="w-5 h-5 text-blue-400" />}
                          <div>
                            <div className="font-semibold">{alert.message}</div>
                            <div className="text-sm text-muted-foreground">{alert.time}</div>
                          </div>
                        </div>
                        <Badge
                          variant={
                            alert.severity === 'High' ? 'destructive' :
                            alert.severity === 'Medium' ? 'default' : 'secondary'
                          }
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Performance Charts */}
            <section>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="frosted-glass">
                  <CardHeader>
                    <CardTitle>Mining Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MiningPerformanceChart />
                  </CardContent>
                </Card>

                <Card className="frosted-glass">
                  <CardHeader>
                    <CardTitle>Hash Rate Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HashRateChart />
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* Mining Pools Tab */}
          <TabsContent value="pools" className="space-y-8">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold gold-text">Mining Pools</h2>
                <EnhancedButton>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Pool
                </EnhancedButton>
              </div>

              <div className="space-y-4">
                {miningPools.map((pool) => (
                  <Card key={pool.id} className="frosted-glass">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                            <Database className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{pool.name}</h3>
                            <p className="text-sm text-muted-foreground">ID: {pool.id}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-6 text-center">
                          <div>
                            <div className="text-lg font-bold text-primary">{pool.hashRate}</div>
                            <div className="text-xs text-muted-foreground">Hash Rate</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-blue-400">{pool.miners.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Miners</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-400">{pool.efficiency}%</div>
                            <div className="text-xs text-muted-foreground">Efficiency</div>
                          </div>
                          <div>
                            <Badge
                              variant={pool.status === 'Active' ? 'default' : 'destructive'}
                            >
                              {pool.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <EnhancedButton variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </EnhancedButton>
                          <EnhancedButton variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </EnhancedButton>
                          <EnhancedButton variant="outline" size="sm">
                            <Settings className="w-4 h-4" />
                          </EnhancedButton>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-8">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold gold-text">Recent Users</h2>
                <div className="flex gap-2">
                  <Input placeholder="Search users..." className="w-64" />
                  <EnhancedButton variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </EnhancedButton>
                </div>
              </div>

              <Card className="frosted-glass">
                <CardContent className="p-0">
                  <div className="divide-y divide-border/20">
                    {recentUsers.map((user, index) => (
                      <div key={user.address} className="p-4 hover:bg-muted/10 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-mono text-sm">{user.address}</div>
                              <div className="text-xs text-muted-foreground">Joined: {user.joinDate}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-6 text-center">
                            <div>
                              <div className="text-sm font-semibold">{user.hashRate}</div>
                              <div className="text-xs text-muted-foreground">Hash Rate</div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-primary">{user.rewards}</div>
                              <div className="text-xs text-muted-foreground">Total Rewards</div>
                            </div>
                            <div>
                              <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                                {user.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <EnhancedButton variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </EnhancedButton>
                            <EnhancedButton variant="outline" size="sm">
                              <Mail className="w-4 h-4" />
                            </EnhancedButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-6 gold-text">Advanced Analytics</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="frosted-glass">
                  <CardHeader>
                    <CardTitle>Pool Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PoolComparisonChart />
                  </CardContent>
                </Card>

                <Card className="frosted-glass">
                  <CardHeader>
                    <CardTitle>ETH Price Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PriceChart coinId="ethereum" days={30} height={300} />
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-6 gold-text">System Settings</h2>

              <div className="grid gap-6">
                <Card className="frosted-glass">
                  <CardHeader>
                    <CardTitle>Pool Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Mining Fee (%)</label>
                        <Input defaultValue="1.0" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Minimum Payout (ETH)</label>
                        <Input defaultValue="0.1" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Block Reward (ETH)</label>
                        <Input defaultValue="2.0" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Payout Interval (hours)</label>
                        <Input defaultValue="24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="frosted-glass">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">2FA Required for Admin</div>
                        <div className="text-sm text-muted-foreground">Require two-factor authentication</div>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">IP Whitelist</div>
                        <div className="text-sm text-muted-foreground">Restrict access by IP address</div>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Audit Logging</div>
                        <div className="text-sm text-muted-foreground">Log all admin actions</div>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add bottom padding */}
      <div className="h-20" />
    </div>
  )
}
