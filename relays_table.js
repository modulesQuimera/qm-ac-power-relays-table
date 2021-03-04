module.exports = function(RED) {

    var mapeamentoNode;

    function relays_tableNode(config) {
        RED.nodes.createNode(this, config);
        this.mapeamento = config.mapeamento;
        this.VA = config.VA;
        this.VB = config.VB;
        this.VC = config.VC;
        this.VN = config.VN;
        this.IA = config.IA;
        this.IB = config.IB;
        this.IC = config.IC;
        this.MASTER = config.MASTER;

        var node = this;
        mapeamentoNode = RED.nodes.getNode(this.mapeamento);
        
        node.on('input', function(msg, send, done) {
            var globalContext = node.context().global;
            var exportMode = globalContext.get("exportMode");
            var currentMode = globalContext.get("currentMode");

            var command = {
                type: "AC_power_source_virtual_V1_0",
                slot: parseInt(mapeamentoNode.slot),
                method: "relays_table",
                compare:{},
                VA: node.VA,
                VB: node.VB,
                VC: node.VC,
                VN: node.VN,
                IA: node.IA,
                IB: node.IB,
                IC: node.IC,
                master: node.MASTER,
            };

            var file = globalContext.get("exportFile");
            var slot = globalContext.get("slot");
            if (!(slot === "begin" || slot === "end")) {
                if (currentMode == "test") {
                    file.slots[slot].jig_test.push(command);
                } else {
                    file.slots[slot].jig_error.push(command);
                }
            } else {
                if (slot === "begin") {
                    file.slots[0].jig_test.push(command);
                } else {
                    file.slots[3].jig_test.push(command);
                }
            }
            globalContext.set("exportFile", file);
            send(msg);
        });
    }
    RED.nodes.registerType("relays_table", relays_tableNode);
};