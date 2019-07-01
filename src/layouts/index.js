// import styles from './index.css';

function BasicLayout(props) {
  return (
    <div style={{height:'100%'}}>
      {props.children}
    </div>
  );
}

export default BasicLayout;
