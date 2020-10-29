import React, { useState, useEffect, InputHTMLAttributes, useRef} from 'react';

import {Container} from './styles'


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  containerStyle?: object;
  ch(name: string, value: string): void;
  setChangeElement(namekey: string): void;
  //ref: React.RefObject<any>

}

// interface Data {
//   name: string;
//   value: string;
// }

interface Data {
  [index: string]: number | string;

}

export const Input: React.FC<InputProps> = ({name, ch, setChangeElement, ...rest}) => {
  const [value, setValue] = useState('')
  const ref = useRef<HTMLInputElement>(null)

  useEffect(()=> {
    ref.current?.focus();
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
    ch(name, event.target.value )
  }

  const handleDelete = () => {
    console.log('handleDelete Input')
    setChangeElement(name)
  }

  console.log('Input', {...rest})
  return (
    <Container>
      <input {...rest} onChange={handleChange} value={value} ref={ref}/>
      <button type='button' onClick={handleDelete}>Delete</button>
    </Container>
  )
}


const App: React.FC = () => {
  const [elements, setElements] = useState<React.FunctionComponentElement<InputProps>[]>([])
  const [count, setCount] = useState(0)
  const [values, setValues] = useState<Data>({})
  const [changeElement, setChangeElement] = useState('')
  const [printValues, setPrintValues] = useState('')

  const ref = useRef(null)

  useEffect(()=> {
   const key = changeElement.split('-')[1]
   setElements(prevState => prevState.filter((element) => element.key !== key))
   
   delete values[changeElement]

  }, [changeElement, values])

  const handleChange = (name: string, value: string) => {
    setValues({...values, [name]: value})
    
  } 

  useEffect(()=> {
    elements.length && 
    console.log('MINHA REF', ref.current)
  }, [elements])

  const createInput = () => {
   
    const element = React.createElement(Input, {key: count, name: `input-${count}`, ch: handleChange, setChangeElement: setChangeElement}, null)

    setCount(count + 1)
    setElements([...elements, element])
   
  }

  const print = () => {
    setPrintValues(JSON.stringify(values))
  }

  console.log('createInput', elements)
  return (
    <div> 
      Hello<br/>
      {elements}
      <input type='text'onFocus={createInput}/>
      {/* <button type='button' onClick={createInput}>Adicionar</button> */}

      <br/><br/>
      
      <button type='button' onClick={print}>Enviar</button>
      <br/>
      {printValues}

      <br/><br/>
      <h2> Próximas tarefas</h2>
      <ul>
      <li>
         <s> Resolver a dependencia do effect</s>
        </li>
        <li>
          <s>Trocar Focus quando clicar no input principal</s>
        </li>
        <li>
          Resolver o problema dos valores ao enviar
        </li>
        <li>
          Remover com duplo clique
        </li>
        <li>
          Adicionar validações e mensagens de erro
        </li>
        <li>
          Adicionar uma estilização para apresentação
        </li>

      </ul>
    </div>
  );
}

export default App;
