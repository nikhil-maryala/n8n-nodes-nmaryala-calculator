import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

export class Example implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Calculator',
		name: 'example',
		icon: { light: 'file:example.svg', dark: 'file:example.dark.svg' },
		group: ['transform'],
		version: [1],
		subtitle: '={{$parameter["operation"]}}',
		description: 'Adds three numbers',
		defaults: {
			name: 'Calculator',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [{ name: 'Sum', value: 'sum', action: 'Add a b and c' }],
				default: 'sum',
			},
			{
				displayName: 'A',
				name: 'a',
				type: 'number',
				default: 0,
				description: 'The first number to add',
			},
			{
				displayName: 'B',
				name: 'b',
				type: 'number',
				default: 0,
				description: 'The second number to add',
			},
			{
				displayName: 'C',
				name: 'c',
				type: 'number',
				default: 0,
				description: 'The third number to add',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const a = this.getNodeParameter('a', itemIndex) as number;
				const b = this.getNodeParameter('b', itemIndex) as number;
				const c = this.getNodeParameter('c', itemIndex) as number;
				returnData.push({ json: { sum: a + b + c }, pairedItem: itemIndex });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message }, pairedItem: itemIndex });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error, { itemIndex });
			}
		}

		return [returnData];
	}
}
