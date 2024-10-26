import { Home, FileText, Layout as LayoutIcon, Settings as SettingsIcon, CreditCard, BarChart } from 'lucide-react';

const navItems = [
  {
    to: '/',
    icon: <Home className="h-5 w-5" />,
    label: 'ホーム'
  },
  {
    to: '/notes',
    icon: (
      <div className="flex items-center gap-1">
        <FileText className="h-5 w-5" />
        <span className="text-xs text-gray-500">(⌘+M)</span>
      </div>
    ),
    label: 'メモ＆タスク'
  },
  {
    to: '/template-and-service',
    icon: <LayoutIcon className="h-5 w-5" />,
    label: 'テンプレート管理'
  },
  {
    to: '/subscriptions',
    icon: <CreditCard className="h-5 w-5" />,
    label: 'サブスク管理'
  },
  {
    to: '/analytics',
    icon: <BarChart className="h-5 w-5" />,
    label: '利用分析'
  },
  {
    to: '/settings',
    icon: <SettingsIcon className="h-5 w-5" />,
    label: '設定'
  }
];

export { navItems };