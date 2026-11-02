import App from './App.js';
import { readConverterHandoff } from './converter-handoff.js';
class AppErrorBoundary extends React.Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { error: null }
        });
    }
    static getDerivedStateFromError(error) {
        return { error };
    }
    render() {
        if (this.state.error) {
            return (React.createElement("main", { className: "app-fallback" },
                React.createElement("h1", null, "Perler Beads Generator"),
                React.createElement("p", null, "\u9875\u9762\u52A0\u8F7D\u65F6\u9047\u5230\u4E00\u4E2A\u95EE\u9898\u3002"),
                React.createElement("pre", null, this.state.error.message),
                React.createElement("button", { onClick: () => window.location.reload() }, "\u91CD\u65B0\u52A0\u8F7D")));
        }
        return this.props.children;
    }
}
let initialHandoff = null;
try {
    initialHandoff = await readConverterHandoff();
} catch (error) {
    document.getElementById('root').textContent = error.message;
    throw error;
}
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(React.StrictMode, null,
    React.createElement(AppErrorBoundary, null,
        React.createElement(App, { initialHandoff }))));
//# sourceMappingURL=main.js.map
