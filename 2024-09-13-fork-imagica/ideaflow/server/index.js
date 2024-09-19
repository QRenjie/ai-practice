import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { VM } from 'vm2';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/execute', (req, res) => {
  const { code } = req.body;
  
  const vm = new VM({
    timeout: 3000, // 3秒超时
    sandbox: {
      console: {
        log: (...args: any[]) => {
          console.log(...args);
          return args.join(' ');
        }
      }
    }
  });

  try {
    const result = vm.run(code);
    res.json({ result: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`代码执行服务器运行在端口 ${PORT}`));
