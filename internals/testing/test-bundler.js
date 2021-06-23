// needed for regenerator-runtime
// (ES7 generator support is required by redux-saga)
import 'core-js'
import Enzyme from 'enzyme'
import EnzymeAdapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new EnzymeAdapter() })
