import {
  useState,
  useEffect
} from 'react'
import axios from 'axios';

import { Layout, Card, Table } from 'antd';
import  avatar from  './avatar.jpeg';
import './App.css';

const { Content } = Layout;
const { Column, ColumnGroup } = Table;

const fetchValidator =  () => {
  return axios.get('//167.86.99.207:1317/cosmos/staking/v1beta1/validators/nolusvaloper19mad22hg5pddpxdzhf6af2xjq0spmsmkh3g8gy');
}

const fetchDelegations =  () => {
  return axios.get('//167.86.99.207:1317/cosmos/staking/v1beta1/validators/nolusvaloper19mad22hg5pddpxdzhf6af2xjq0spmsmkh3g8gy/delegations');
}

const fetchTransactions = () => {
  return axios.get('//net-rila.nolus.io:1317/cosmos/tx/v1beta1/txs?events=message.sender=%27nolus19mad22hg5pddpxdzhf6af2xjq0spmsmkwpazte%27&pagination.reverse=true&order_by=ORDER_BY_DESC')
}


const emptyValidator = {
  description : {
    moniker: '',
    website: '',
    details: '',
  },
  commission: {
    commission_rates: {
      rate: 0,
      max_change_rate: 0,
      max_rate: 0
    },
    update_time: ''
  }
}


const  App = () => {

  const [validator, setValidator] = useState(emptyValidator);
  const [addresses, setAddresses] = useState({
    accoaunt: '',
    operator: '',
    consensus: '',
    hex: ''
  });
  const [bonded, setBonded] = useState({
      self: 0,
      delegators: 0,
      height: 0
  })
  const [tx, setTx] = useState([]);

  const fetchApi = async () => {
    const { data } =  await fetchValidator();
    setValidator(data.validator)
    const respAddr = await fetchDelegations()
    const addresses = {
      accoaunt: respAddr.data.delegation_responses[0].delegation.delegator_address,
      operator: respAddr.data.delegation_responses[0].delegation.validator_address,
      consensus: JSON.stringify(data.validator.consensus_pubkey),
      hex: 'DEE7DF7DB27226720F7BA25A4F6D35B8252BCC96'
    }
    setAddresses(addresses)
    setBonded({
      self: 1,
      delegators: 1,
      height: 1
    })
    const tx = await fetchTransactions();
    setTx(tx.data.tx_responses)
  }

  useEffect(() => {
    fetchApi();
  },[])
  console.error(tx)
  return (
    <Content style={{ 
      padding: '0 0.67em'
    }}>

      <h1>Validator Info</h1>

      <Card className='validator-card'>
        <div className='validator-img'><img src={avatar}/></div>
        <h2>{validator.description.moniker}</h2>
        <a href={validator.description.website} target='_blank' rel='noopener norefferer'>{validator.description.website}</a>
        <p>{validator.description.details}</p>
      </Card>

      <div className='row'>
        <Card className='card validator-status'>
          <h3>Status</h3>
          <div>
              Status:
              <span>{validator.status === 'BOND_STATUS_UNBONDED' ? 'Inactive' : 'Active'}</span>
          </div>
          <div>
              In Jail:
              <span>{validator.jailed ? 'No' : 'Yes'}</span>
          </div>
          <div>
              Uptime:
              <span>0</span>
          </div>
        </Card>
        <Card className='card comissions'>
          <h3>Comissions</h3>
          <div>
              Commission:
              <span>{validator.commission.commission_rates.rate * 100}%</span>
          </div>
          <div>
              Max Rate:
              <span>{validator.commission.commission_rates.max_rate * 100}%</span>
          </div>
          <div>
              Max Change Rate:
              <span>{validator.commission.commission_rates.max_change_rate * 100}%</span>
          </div>
          <div>
              Updated:
              <span>{validator.commission.update_time.split('T')[0]}</span>
          </div>
        </Card>
         <Card className='card comissions'>
          <h3>Bonded</h3>
          <div>
              Self Bonded:
              <span>100% ({bonded.self}NLS)</span>
          </div>
          <div>
              Delegators:
              <span>{bonded.delegators}%</span>
          </div>
          <div>
              Bonded Height
              <span>{bonded.height}%</span>
          </div>
        </Card>
      </div>

      <Card className='card card-addresses'>
        <h3>Addresses</h3>
        <div>
            Accoaunt:
            <span>{addresses.accoaunt}</span>
        </div>
        <div>
            Operator:
            <span>{addresses.operator}</span>
        </div>
        <div>
            Consensus:
            <span>{addresses.consensus}</span>
        </div>
        <div>
            hex:
            <span>{addresses.hex}</span>
        </div>
      </Card>

      <Card className='card card-addresses'>
        <h3>Uptime by latest blocks</h3>
        <Table dataSource={tx}>
          <ColumnGroup >
            <Column title="Height" dataIndex="height" key="height" width={100}/>
            <Column title="Tx Hash" dataIndex="txhash" key="txHash" ellipsis={true} />
            <Column title="MSGS" dataIndex="logs" key="msgs" render={(_, record) => <span>
                {
                  record.logs.length ? record.logs[0].events[1].type.split('_').join(' ') : record.raw_log
                }
              </span>
            }/>
            <Column title="Time" dataIndex="timestamp" key="time" />
          </ColumnGroup>
        </Table>
      </Card>
      
    </Content>
  );
}

export default App;
