import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@prds/ui/card'
import { Button } from '@prds/ui/button'
import { Badge } from '@prds/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@prds/ui/table'

const deals = [
  { id: '1', prospect: 'Pacific Coast Distributors LLC', stage: 'qualified', amount: '$250K', probability: 80, owner: 'John D.', lastActivity: '2 hours ago' },
  { id: '2', prospect: 'Sunrise Construction Inc', stage: 'proposal', amount: '$150K', probability: 60, owner: 'Sarah M.', lastActivity: '1 day ago' },
  { id: '3', prospect: 'Gulf Coast Marine Services', stage: 'negotiation', amount: '$75K', probability: 40, owner: 'Mike T.', lastActivity: '3 days ago' },
  { id: '4', prospect: 'Empire State Logistics', stage: 'closed-won', amount: '$200K', probability: 100, owner: 'Lisa K.', lastActivity: '1 week ago' }
]

const stages = [
  { id: 'qualified', label: 'Qualified', color: 'bg-blue-100 text-blue-800' },
  { id: 'proposal', label: 'Proposal', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-orange-100 text-orange-800' },
  { id: 'closed-won', label: 'Closed Won', color: 'bg-green-100 text-green-800' },
  { id: 'closed-lost', label: 'Closed Lost', color: 'bg-red-100 text-red-800' }
]

export function DealsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deal Pipeline</h1>
          <p className="text-gray-500 mt-1">Track and manage your deal flow</p>
        </div>
        <Button>Add Deal</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stages.map((stage) => (
          <Card key={stage.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{stage.label}</CardTitle>
                <Badge className={stage.color}>{deals.filter(d => d.stage === stage.id).length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deals.filter(d => d.stage === stage.id).map((deal) => (
                  <div key={deal.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                    <p className="font-medium text-sm">{deal.prospect}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-gray-900">{deal.amount}</span>
                      <Badge variant="outline">{deal.probability}%</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <span>{deal.owner}</span>
                      <span>{deal.lastActivity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}