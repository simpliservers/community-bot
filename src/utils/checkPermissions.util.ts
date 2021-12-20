import { readFileSync } from 'fs';
import { load } from 'js-yaml';

const conf: any = load(readFileSync('./config.yml', 'utf8'));

function checkUserPermissions(member: any): boolean {
  member.roles.member._roles.forEach((role: any) => {
    if (role === conf.modRole) return true;
  });

  if (
    member.permissions.has('KICK_MEMBERS', {
      checkAdmin: false,
      checkOwner: false,
    })
  )
    return true;

  return false;
}

export default checkUserPermissions;
