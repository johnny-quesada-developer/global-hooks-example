import { GlobalHooksExample } from './GlobalHooksExample';
import { ReactContextExample } from './ReactContextExample';
import './SnakeExample';

function App() {
  return (
    <div className='flex justify-center'>
      <ReactContextExample />
      <GlobalHooksExample />
    </div>
  );
}

export default App;
