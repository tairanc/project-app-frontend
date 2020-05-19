import TestUtils from 'react-addons-test-utils';
//import a from '../../../src/pages/store/home/index.jsx';
function shallowRender(Component, props) {
    const renderer = TestUtils.createRenderer();
    renderer.render(<Component {...props}/>);
    return renderer.getRenderOutput();
}
//console.log(a);