import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as AWS from 'aws-sdk';

export const createSecurityGroup = async (
  ec2: AWS.EC2,
  securityGroupName: string,
) => {
  const vpc = await ec2.describeVpcs().promise();
  if (!vpc.Vpcs) {
    throw new NotFoundException('vpc가 없습니다.');
  }
  const defaultVpcId = vpc.Vpcs[0].VpcId;

  const paramsSecurityGroup: AWS.EC2.CreateSecurityGroupRequest = {
    Description: 'Frontend Security Group',
    GroupName: securityGroupName,
    VpcId: defaultVpcId,
  };

  const securityGroup = await ec2
    .createSecurityGroup(paramsSecurityGroup)
    .promise();

  const securityGroupId = securityGroup.GroupId;
  if (!securityGroupId) {
    throw new InternalServerErrorException(
      'securityGroupId가 생성되지 않았습니다.',
    );
  }

  const paramsIngress = {
    GroupId: securityGroupId,
    IpPermissions: [
      {
        IpProtocol: 'tcp',
        FromPort: 80,
        ToPort: 80,
        IpRanges: [{ CidrIp: '0.0.0.0/0' }],
      },
      {
        IpProtocol: 'tcp',
        FromPort: 22,
        ToPort: 22,
        IpRanges: [{ CidrIp: '0.0.0.0/0' }],
      },
    ],
  };

  const data = await ec2.authorizeSecurityGroupIngress(paramsIngress).promise();
  console.log('Ingress Successfully Set', data);

  return securityGroupId;
};
