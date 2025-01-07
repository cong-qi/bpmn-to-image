const { expect } = require('chai');

const { accessSync } = require('fs');

const path = require('path');

const { convertAll, convert } = require('..');

const input = path.join(__dirname, 'diagram.bpmn');
const xmlInput = `<?xml version="1.0" encoding="UTF-8"?>\n<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:activiti="http://activiti.org/bpmn" targetNamespace="http://bpmn.io/schema/bpmn">\n  <bpmn:process id="Newsc0tbxxdjhwl" name="New-SC-0-投标信息登记-海外类-海外总部" isExecutable="true">\n    <bpmn:startEvent id="StartEvent_1" name="开始">\n      <bpmn:outgoing>SequenceFlow_0iwwynl</bpmn:outgoing>\n    </bpmn:startEvent>\n    <bpmn:userTask id="UserTask_0vz4wcw" name="珠江海外市场部经办人">\n      <bpmn:incoming>SequenceFlow_0eztv0z</bpmn:incoming>\n      <bpmn:outgoing>SequenceFlow_181zx4c</bpmn:outgoing>\n    </bpmn:userTask>\n    <bpmn:userTask id="UserTask_17tv9zi" name="珠江海外市场部部门负责人">\n      <bpmn:incoming>SequenceFlow_181zx4c</bpmn:incoming>\n      <bpmn:outgoing>SequenceFlow_1k5bfnt</bpmn:outgoing>\n    </bpmn:userTask>\n    <bpmn:sequenceFlow id="SequenceFlow_181zx4c" sourceRef="UserTask_0vz4wcw" targetRef="UserTask_17tv9zi"/>\n    <bpmn:endEvent id="EndEvent_0v1gvwy" name="结束">\n      <bpmn:incoming>SequenceFlow_1k5bfnt</bpmn:incoming>\n    </bpmn:endEvent>\n    <bpmn:sequenceFlow id="SequenceFlow_1k5bfnt" sourceRef="UserTask_17tv9zi" targetRef="EndEvent_0v1gvwy"/>\n    <bpmn:userTask id="UserTask_01gs19k" name="发起人">\n      <bpmn:incoming>SequenceFlow_0iwwynl</bpmn:incoming>\n      <bpmn:outgoing>SequenceFlow_0eztv0z</bpmn:outgoing>\n    </bpmn:userTask>\n    <bpmn:sequenceFlow id="SequenceFlow_0iwwynl" sourceRef="StartEvent_1" targetRef="UserTask_01gs19k"/>\n    <bpmn:sequenceFlow id="SequenceFlow_0eztv0z" sourceRef="UserTask_01gs19k" targetRef="UserTask_0vz4wcw"/>\n  </bpmn:process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_36001253571173">\n      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\n        <dc:Bounds x="173" y="102" width="36" height="36"/>\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="181" y="138" width="22" height="14"/>\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="UserTask_0vz4wcw_di" bpmnElement="UserTask_0vz4wcw">\n        <dc:Bounds x="460" y="80" width="100" height="80"/>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="UserTask_17tv9zi_di" bpmnElement="UserTask_17tv9zi">\n        <dc:Bounds x="690" y="80" width="100" height="80"/>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge id="SequenceFlow_181zx4c_di" bpmnElement="SequenceFlow_181zx4c">\n        <di:waypoint x="560" y="120"/>\n        <di:waypoint x="690" y="120"/>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id="EndEvent_0v1gvwy_di" bpmnElement="EndEvent_0v1gvwy">\n        <dc:Bounds x="1092" y="102" width="36" height="36"/>\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="1099" y="145" width="22" height="14"/>\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge id="SequenceFlow_1k5bfnt_di" bpmnElement="SequenceFlow_1k5bfnt">\n        <di:waypoint x="790" y="120"/>\n        <di:waypoint x="1092" y="120"/>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id="UserTask_01gs19k_di" bpmnElement="UserTask_01gs19k">\n        <dc:Bounds x="260" y="80" width="100" height="80"/>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge id="SequenceFlow_0iwwynl_di" bpmnElement="SequenceFlow_0iwwynl">\n        <di:waypoint x="209" y="120"/>\n        <di:waypoint x="260" y="120"/>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="SequenceFlow_0eztv0z_di" bpmnElement="SequenceFlow_0eztv0z">\n        <di:waypoint x="360" y="120"/>\n        <di:waypoint x="460" y="120"/>\n      </bpmndi:BPMNEdge>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn:definitions>`;

const outputPNG = path.join(__dirname, 'diagram.png');
const outputPDF = path.join(__dirname, 'diagram.pdf');
const outputSVG = path.join(__dirname, 'diagram.svg');

describe('index', function () {
  // tests may take some time
  this.timeout(10000);

  process.env.NO_CLEANUP ||
    afterEach(async function () {
      await del(['*.png', '*.pdf', '*.svg'], { cwd: __dirname });
    });

  describe('#convertAll', function () {
    it('should apply defaults', async function () {
      // when
      await convertAll([
        {
          input,
          outputs: [outputPNG, outputPDF, outputSVG],
        },
      ]);

      // then
      expectExists(outputPNG, true);
      expectExists(outputPDF, true);
      expectExists(outputSVG, true);
    });
  });

  describe('#convert', function () {
    it('should apply defaults', async function () {
      // when
      await convert(input, outputPNG);

      // then
      expectExists(outputPNG, true);
      expectExists(outputPDF, false);
    });
  });

  describe('#convert with XML string', function () {
    it('should convert from XML string correctly', async function () {
      // when
      await convert(xmlInput, outputPNG, true);

      // then
      expectExists(outputPNG, true);
    });
  });
});

// helpers ////////////////////

function expectExists(path, exists) {
  try {
    accessSync(path);

    expect(true).to.equal(exists, `expected ${path} to NOT exist`);
  } catch (e) {
    expect(false).to.equal(exists, `expected ${path} to exist`);
  }
}

async function del(...args) {
  const deleteAsync = (await import('del')).deleteAsync;

  return deleteAsync(...args);
}
