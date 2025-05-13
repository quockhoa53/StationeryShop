import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
  {
    name: 'Tháng 1',
    Expense: 4000,
    Income: 2400
  },
  {
    name: 'Tháng 2',
    Expense: 3000,
    Income: 1398
  },
  {
    name: 'Tháng 3',
    Expense: 2000,
    Income: 9800
  },
  {
    name: 'Tháng 4',
    Expense: 2780,
    Income: 3908
  },
  {
    name: 'Tháng 5',
    Expense: 1890,
    Income: 4800
  },
  {
    name: 'Tháng 6',
    Expense: 2390,
    Income: 3800
  },
  {
    name: 'Tháng 7',
    Expense: 3490,
    Income: 4300
  },
  {
    name: 'Tháng 8',
    Expense: 2000,
    Income: 9800
  },
  {
    name: 'Tháng 9',
    Expense: 2780,
    Income: 3908
  },
  {
    name: 'Tháng 10',
    Expense: 1890,
    Income: 4800
  },
  {
    name: 'Tháng 11',
    Expense: 2390,
    Income: 3800
  },
  {
    name: 'Tháng 12',
    Expense: 3490,
    Income: 4300
  }
]

function TransactionChart() {
  return (
    <div className='h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1'>
      <strong className='text-gray-700 font-medium'>Transactions</strong>
      <div className='mt-3 w-full flex-1 text-xs'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 10,
              left: -10,
              bottom: 0
            }}
          >
            <CartesianGrid strokeDasharray='3 3 0 0' vertical={false} />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='Income' name='Thu nhập' fill='#0ea5e9' />
            <Bar dataKey='Expense' name='Chi phí' fill='#ea580c' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TransactionChart
